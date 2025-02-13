import { subDays } from "date-fns";
import { Attachment, User, Document, Collection, Team } from "@server/models";
import {
  buildAttachment,
  buildUser,
  buildTeam,
  buildDocument,
} from "@server/test/factories";
import { flushdb } from "@server/test/support";
import teamPermanentDeleter from "./teamPermanentDeleter";

jest.mock("aws-sdk", () => {
  const mS3 = {
    deleteObject: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    S3: jest.fn(() => mS3),
    Endpoint: jest.fn(),
  };
});
beforeEach(() => flushdb());
describe("teamPermanentDeleter", () => {
  it("should destroy related data", async () => {
    const team = await buildTeam({
      deletedAt: subDays(new Date(), 90),
    });
    const user = await buildUser({
      teamId: team.id,
    });
    await buildDocument({
      teamId: team.id,
      userId: user.id,
    });
    await teamPermanentDeleter(team);
    expect(await Team.count()).toEqual(0);
    expect(await User.count()).toEqual(0);
    expect(
      await Document.unscoped().count({
        paranoid: false,
      })
    ).toEqual(0);
    expect(
      await Collection.unscoped().count({
        paranoid: false,
      })
    ).toEqual(0);
  });

  it("should not destroy unrelated data", async () => {
    const team = await buildTeam({
      deletedAt: subDays(new Date(), 90),
    });
    await buildUser();
    await buildTeam();
    await buildDocument();
    await teamPermanentDeleter(team);
    expect(await Team.count()).toEqual(4); // each build command creates a team

    expect(await User.count()).toEqual(2);
    expect(
      await Document.unscoped().count({
        paranoid: false,
      })
    ).toEqual(1);
    expect(
      await Collection.unscoped().count({
        paranoid: false,
      })
    ).toEqual(1);
  });

  it("should destroy attachments", async () => {
    const team = await buildTeam({
      deletedAt: subDays(new Date(), 90),
    });
    const user = await buildUser({
      teamId: team.id,
    });
    const document = await buildDocument({
      teamId: team.id,
      userId: user.id,
    });
    await buildAttachment({
      teamId: document.teamId,
      documentId: document.id,
    });
    await teamPermanentDeleter(team);
    expect(await Team.count()).toEqual(0);
    expect(await User.count()).toEqual(0);
    expect(await Attachment.count()).toEqual(0);
    expect(
      await Document.unscoped().count({
        paranoid: false,
      })
    ).toEqual(0);
    expect(
      await Collection.unscoped().count({
        paranoid: false,
      })
    ).toEqual(0);
  });

  it("should error when trying to destroy undeleted team", async () => {
    const team = await buildTeam();
    let error;

    try {
      await teamPermanentDeleter(team);
    } catch (err) {
      error = err.message;
    }

    expect(error).toEqual(
      `Cannot permanently delete ${team.id} team. Please delete it and try again.`
    );
  });
});
