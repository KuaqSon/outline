// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  interface EditorTheme {
    background: string;
    text: string;
    cursor: string;
    divider: string;
    toolbarBackground: string;
    toolbarHoverBackground: string;
    toolbarInput: string;
    toolbarItem: string;
    tableDivider: string;
    tableSelected: string;
    tableSelectedBackground: string;
    quote: string;
    codeBackground: string;
    codeBorder: string;
    horizontalRule: string;
    scrollbarBackground: string;
    scrollbarThumb: string;
    fontFamily: string;
    fontFamilyMono: string;
    fontWeight: number;
    zIndex: number;
    link: string;
    placeholder: string;
    textSecondary: string;
    textHighlight: string;
    textHighlightForeground: string;
    selected: string;
    codeComment: string;
    codePunctuation: string;
    codeNumber: string;
    codeProperty: string;
    codeTag: string;
    codeString: string;
    codeSelector: string;
    codeAttr: string;
    codeEntity: string;
    codeKeyword: string;
    codeFunction: string;
    codeStatement: string;
    codePlaceholder: string;
    codeInserted: string;
    codeImportant: string;
    blockToolbarBackground: string;
    blockToolbarTrigger: string;
    blockToolbarTriggerIcon: string;
    blockToolbarItem: string;
    blockToolbarIcon: undefined;
    blockToolbarIconSelected: string;
    blockToolbarText: string;
    blockToolbarTextSelected: string;
    blockToolbarSelectedBackground: string;
    blockToolbarHoverBackground: string;
    blockToolbarDivider: string;
    noticeInfoBackground: string;
    noticeInfoText: string;
    noticeTipBackground: string;
    noticeTipText: string;
    noticeWarningBackground: string;
    noticeWarningText: string;
  }

  interface Colors {
    transparent: string;
    almostBlack: string;
    lightBlack: string;
    almostWhite: string;
    veryDarkBlue: string;
    slate: string;
    slateLight: string;
    slateDark: string;
    smoke: string;
    smokeLight: string;
    smokeDark: string;
    white: string;
    white10: string;
    white50: string;
    black: string;
    black05: string;
    black10: string;
    black50: string;
    primary: string;
    yellow: string;
    warmGrey: string;
    searchHighlight: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
    brand: {
      red: string;
      pink: string;
      purple: string;
      blue: string;
      marine: string;
      green: string;
      yellow: string;
    };
  }

  interface Spacing {
    padding: string;
    vpadding: string;
    hpadding: string;
    sidebarWidth: number;
    sidebarCollapsedWidth: number;
    sidebarMinWidth: number;
    sidebarMaxWidth: number;
  }

  interface Breakpoints {
    mobile: number;
    tablet: number;
    desktop: number;
    desktopLarge: number;
  }

  interface Depths {
    header: number;
    sidebar: number;
    hoverPreview: number;
    modalOverlay: number;
    modal: number;
    menu: number;
    toasts: number;
    popover: number;
    titleBarDivider: number;
    loadingIndicatorBar: number;
    commandBar: number;
  }

  export interface DefaultTheme extends Colors, Spacing, EditorTheme {
    background: string;
    backgroundTransition: string;
    buttonBackground: string;
    buttonText: string;
    secondaryBackground: string;
    link: string;
    text: string;
    cursor: string;
    textSecondary: string;
    textTertiary: string;
    placeholder: string;
    sidebarBackground: string;
    sidebarItemBackground: string;
    sidebarText: string;
    backdrop: string;
    shadow: string;
    menuItemSelected: string;
    menuBackground: string;
    menuShadow: string;
    menuBorder?: string;
    divider: string;
    titleBarDivider: string;
    inputBorder: string;
    inputBorderFocused: string;
    listItemHoverBackground: string;
    buttonNeutralBackground: string;
    buttonNeutralText: string;
    buttonNeutralBorder: string;
    tooltipBackground: string;
    tooltipText: string;
    toastBackground: string;
    toastText: string;
    quote: string;
    codeBackground: string;
    codeBorder: string;
    embedBorder: string;
    horizontalRule: string;
    progressBarBackground: string;
    scrollbarBackground: string;
    scrollbarThumb: string;

    breakpoints: Breakpoints;
    depths: Depths;
  }
}
