import ComponentTypes from "@theme-original/NavbarItem/ComponentTypes";
import NavbarTranslateButton from "@site/src/components/NavbarTranslateButton";
import NavbarPersonalizeButton from "@site/src/components/NavbarPersonalizeButton";
import NavbarAuthItems from "@site/src/components/NavbarAuthItems";

export default {
  ...ComponentTypes,
  "custom-translate": NavbarTranslateButton,
  "custom-personalize": NavbarPersonalizeButton,
  "custom-auth": NavbarAuthItems,
};
