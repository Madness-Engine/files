window.RufflePlayer = window.RufflePlayer || {};
window.RufflePlayer.config = {
    // Options affecting the whole page
    "publicPath": undefined,
    "polyfills": true,

    // Options affecting files only
    "allowScriptAccess": false, // Polyfill elements have a different default value, see the allowScriptAccess section
    "autoplay": "auto",
    "unmuteOverlay": "visible",
    "backgroundColor": null,
    "wmode": "window",
    "letterbox": "fullscreen",
    "warnOnUnsupportedContent": true,
    "contextMenu": "on",
    "showSwfDownload": false,
    "upgradeToHttps": window.location.protocol === "https:",
    "maxExecutionDuration": 15,
    "logLevel": "error",
    "base": null,
    "menu": true,
    "salign": "",
    "forceAlign": false,
    "scale": "showAll",
    "forceScale": false,
    "frameRate": null,
    "quality": "high",
    "splashScreen": false,
    "preferredRenderer": null,
    "openUrlMode": "allow",
    "allowNetworking": "all",
    "favorFlash": true,
    "socketProxy": [],
    "fontSources": [],
    "defaultFonts": {},
    "credentialAllowList": [],
    "playerRuntime": "flashPlayer",
    "allowFullscreen": true;
};

import ruffle from "module-name";

class FlashPlayerExtension {
  getInfo() {
    return {
      id: 'AdobeFlash',
      name: 'Abode Flash Player',
      blocks: [
        {
          opcode: 'embed',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'load [ONE]',
          arguments: {
            ONE: {
              type: Scratch.ArgumentType.STRING
            },
            }
          }
        }
      ]
    };
  }

  embed(args) {
     window.RufflePlayer = window.RufflePlayer || {};
    window.addEventListener("load", (event) => {
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        const container = document.getElementById("container");
        container.appendChild(player);
        player.load(args.ONE);
    });
  }
}
Scratch.extensions.register(new StrictEqualityExtension());