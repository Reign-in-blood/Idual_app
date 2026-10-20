/** NEC1 iDual RC II codes transcribed from independently tested irplus profile. */
export const commands = [
  {
    "id": "on",
    "label": "On",
    "code": "0x407F807F"
  },
  {
    "id": "off",
    "label": "Off",
    "code": "0x407F40BF"
  },
  {
    "id": "dimUp",
    "label": "Dim Up",
    "code": "0x407F906F"
  },
  {
    "id": "dimDown",
    "label": "Dim Down",
    "code": "0x407F08F7"
  },
  {
    "id": "candle",
    "label": "Candle Light",
    "code": "0x407F8877"
  },
  {
    "id": "warmWhite",
    "label": "Warm White",
    "code": "0x407F6897"
  },
  {
    "id": "daylight",
    "label": "Daylight",
    "code": "0x407F50AF"
  },
  {
    "id": "coolWhite",
    "label": "Cool White",
    "code": "0x407FC03F"
  },
  {
    "id": "night",
    "label": "Night Light",
    "code": "0x407F48B7"
  },
  {
    "id": "sleep",
    "label": "Sleeping",
    "code": "0x407FE817"
  },
  {
    "id": "work",
    "label": "Working",
    "code": "0x407FD02F"
  },
  {
    "id": "relax",
    "label": "Relaxing",
    "code": "0x407F20DF"
  },
  {
    "id": "sunrise",
    "label": "Sunrise",
    "code": "0x407FC837"
  },
  {
    "id": "pastelColor",
    "label": "Pastel color",
    "code": "0x407F18E7"
  },
  {
    "id": "party",
    "label": "Party",
    "code": "0x407F30CF"
  },
  {
    "id": "sunset",
    "label": "Sunset",
    "code": "0x407FA05F"
  },
  {
    "id": "forest",
    "label": "Forest",
    "code": "0x407F28D7"
  },
  {
    "id": "ocean",
    "label": "Ocean",
    "code": "0x407F9867"
  },
  {
    "id": "fireplace",
    "label": "Fireplace",
    "code": "0x407FB04F"
  },
  {
    "id": "romance",
    "label": "Romance",
    "code": "0x407F609F"
  },
  {
    "id": "red",
    "label": "Fixed: Red",
    "code": "0x407F708F"
  },
  {
    "id": "orange",
    "label": "Fixed: Orange",
    "code": "0x407FE01F"
  },
  {
    "id": "green",
    "label": "Fixed: Green",
    "code": "0x407F10EF"
  },
  {
    "id": "blue",
    "label": "Fixed: Blue",
    "code": "0x407FA857"
  },
  {
    "id": "vivid",
    "label": "Vivid Colors",
    "code": "0x407F58A7"
  },
  {
    "id": "pastels",
    "label": "Pastel Colors",
    "code": "0x407FF00F"
  }
] as const;
export type CommandId = typeof commands[number]['id'];
export function findCommand(id: CommandId) { return commands.find(command => command.id === id)!; }
