import * as React from "react";
import Frame from "./components/Frame";
import Image from "./components/Image";

const URL_REGEX = new RegExp(
  "^https://docs.google.com/drawings/d/(.*)/(edit|preview)(.*)$"
);
type Props = {
  attrs: {
    href: string;
    matches: string[];
  };
};

export default class GoogleDrawings extends React.Component<Props> {
  static ENABLED = [URL_REGEX];

  render() {
    return (
      <Frame
        {...this.props}
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ src: string; icon: Element; canonicalUrl: ... Remove this comment to see the full error message
        src={this.props.attrs.href.replace("/edit", "/preview")}
        icon={
          <Image
            src="/images/google-drawings.png"
            alt="Google Drawings"
            width={16}
            height={16}
          />
        }
        canonicalUrl={this.props.attrs.href.replace("/preview", "/edit")}
        title="Google Drawings"
        border
      />
    );
  }
}
