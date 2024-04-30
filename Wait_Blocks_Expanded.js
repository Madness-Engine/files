/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "waitblocksmadness",
                "name": "Wait Blocks Expanded",
                "color1": "#0088ff",
                "color2": "#0063ba",
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `days`,
        blockType: Scratch.BlockType.COMMAND,
        text: `wait [4] day(s)`,
        arguments: {
            "4": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 69,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`days`] = async (args, util) => {
        await new Promise(resolve => setTimeout(resolve, (args["4"] * 86400000 / 1)))
    };

    blocks.push({
        opcode: `hour`,
        blockType: Scratch.BlockType.COMMAND,
        text: `wait [3] hours(s)`,
        arguments: {
            "3": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 69,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`hour`] = async (args, util) => {
        await new Promise(resolve => setTimeout(resolve, (args["3"] * 3600000 / 1)))
    };

    blocks.push({
        opcode: `mss`,
        blockType: Scratch.BlockType.COMMAND,
        text: `wait [1] milisecond(s)`,
        arguments: {
            "1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 69,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`mss`] = async (args, util) => {
        await new Promise(resolve => setTimeout(resolve, args["1"]))
    };

    blocks.push({
        opcode: `min`,
        blockType: Scratch.BlockType.COMMAND,
        text: `wait [2] minutes(s)`,
        arguments: {
            "2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 69,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`min`] = async (args, util) => {
        await new Promise(resolve => setTimeout(resolve, (args["2"] * 60000 / 1)))
    };

    Scratch.extensions.register(new Extension());
})(Scratch);