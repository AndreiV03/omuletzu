import fs from "fs";
import path from "path";

import type { Client } from "discord.js";
import type { Command } from "../interfaces/command";

export default {
  name: "ready",
  once: true,
  execute: async (client: Client) => {
    try {
      const commandsDirectoryPath = path.join(__dirname, "..", "commands");
      const commandFiles = fs.readdirSync(commandsDirectoryPath).filter((file) => file.endsWith(".js"));

      commandFiles.forEach(async (file) => {
        const { default: command } = (await import(path.join(commandsDirectoryPath, file))) as { default: Command };
        client.commands.set(command.data.name, command);
      });
    
      console.log("Omuletzu' is online!");
    } catch (error) {
      console.error(error);
    }
  }
};
