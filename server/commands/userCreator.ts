import { Op } from "sequelize";
import { Event, Team, User, UserAuthentication } from "@server/models";
import { sequelize } from "../sequelize";

type UserCreatorResult = {
  // @ts-expect-error ts-migrate(2749) FIXME: 'User' refers to a value, but is being used as a t... Remove this comment to see the full error message
  user: User;
  isNewUser: boolean;
  // @ts-expect-error ts-migrate(2749) FIXME: 'UserAuthentication' refers to a value, but is bei... Remove this comment to see the full error message
  authentication: UserAuthentication;
};

export default async function userCreator({
  name,
  email,
  username,
  isAdmin,
  avatarUrl,
  teamId,
  authentication,
  ip,
}: {
  name: string;
  email: string;
  username?: string;
  isAdmin?: boolean;
  avatarUrl?: string;
  teamId: string;
  ip: string;
  authentication: {
    authenticationProviderId: string;
    providerId: string;
    scopes: string[];
    accessToken?: string;
    refreshToken?: string;
  };
}): Promise<UserCreatorResult> {
  const { authenticationProviderId, providerId, ...rest } = authentication;
  const auth = await UserAuthentication.findOne({
    where: {
      providerId,
    },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });

  // Someone has signed in with this authentication before, we just
  // want to update the details instead of creating a new record
  if (auth) {
    const { user } = auth;

    // We found an authentication record that matches the user id, but it's
    // associated with a different authentication provider, (eg a different
    // hosted google domain). This is possible in Google Auth when moving domains.
    // In the future we may auto-migrate these.
    if (auth.authenticationProviderId !== authenticationProviderId) {
      throw new Error(
        `User authentication ${providerId} already exists for ${auth.authenticationProviderId}, tried to assign to ${authenticationProviderId}`
      );
    }

    if (user) {
      await user.update({
        email,
        username,
      });
      await auth.update(rest);
      return {
        user,
        authentication: auth,
        isNewUser: false,
      };
    }

    // We found an authentication record, but the associated user was deleted or
    // otherwise didn't exist. Cleanup the auth record and proceed with creating
    // a new user. See: https://github.com/outline/outline/issues/2022
    await auth.destroy();
  }

  // A `user` record might exist in the form of an invite even if there is no
  // existing authentication record that matches. In Outline an invite is a
  // shell user record.
  const invite = await User.findOne({
    where: {
      email,
      teamId,
      lastActiveAt: {
        [Op.eq]: null,
      },
    },
    include: [
      {
        model: UserAuthentication,
        as: "authentications",
        required: false,
      },
    ],
  });

  // We have an existing invite for his user, so we need to update it with our
  // new details and link up the authentication method
  if (invite && !invite.authentications.length) {
    const transaction = await sequelize.transaction();
    let auth;

    try {
      await invite.update(
        {
          name,
          avatarUrl,
        },
        {
          transaction,
        }
      );
      auth = await invite.createAuthentication(authentication, {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    return {
      user: invite,
      authentication: auth,
      isNewUser: true,
    };
  }

  // No auth, no user – this is an entirely new sign in.
  const transaction = await sequelize.transaction();

  try {
    const { defaultUserRole } = await Team.findByPk(teamId, {
      attributes: ["defaultUserRole"],
      transaction,
    });
    const user = await User.create(
      {
        name,
        email,
        username,
        isAdmin: typeof isAdmin === "boolean" && isAdmin,
        isViewer: isAdmin === true ? false : defaultUserRole === "viewer",
        teamId,
        avatarUrl,
        service: null,
        authentications: [authentication],
      },
      {
        include: "authentications",
        transaction,
      }
    );
    await Event.create(
      {
        name: "users.create",
        actorId: user.id,
        userId: user.id,
        teamId: user.teamId,
        data: {
          name: user.name,
        },
        ip,
      },
      {
        transaction,
      }
    );
    await transaction.commit();
    return {
      user,
      authentication: user.authentications[0],
      isNewUser: true,
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
