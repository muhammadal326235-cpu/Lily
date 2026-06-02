import {
    SlashCommandBuilder,
} from "discord.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { createEmbed } from "../../utils/embeds.js";
import { InteractionHelper } from "../../utils/interactionHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCOUNTS_PATH = path.join(
    __dirname,
    "../../../accounts.json"
);

export default {
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Login using username and password")
        .addStringOption(option =>
            option
                .setName("username")
                .setDescription("Your username")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("password")
                .setDescription("Your password")
                .setRequired(true)
        ),

    async execute(interaction) {
        await InteractionHelper.safeDefer(interaction, true);

        try {
            const username =
                interaction.options.getString("username");

            const password =
                interaction.options.getString("password");

            const rawData = await fs.readFile(
                ACCOUNTS_PATH,
                "utf8"
            );

            const accounts = JSON.parse(rawData);

            const account = accounts.find(
                acc =>
                    acc.username === username &&
                    acc.password === password
            );

            if (!account) {
                const embed = createEmbed({
                    title: "❌ Login Failed",
                    description:
                        "Username atau password salah.",
                    color: "danger",
                });

                return InteractionHelper.safeEditReply(
                    interaction,
                    {
                        embeds: [embed],
                    }
                );
            }

            const embed = createEmbed({
                title: "✅ Login Success",
                description: `Welcome **${username}**!`,
                color: "success",
            });

            await InteractionHelper.safeEditReply(
                interaction,
                {
                    embeds: [embed],
                }
            );
        } catch (error) {
            console.error(error);

            const embed = createEmbed({
                title: "❌ Error",
                description:
                    "Terjadi kesalahan saat memproses login.",
                color: "danger",
            });

            await InteractionHelper.safeEditReply(
                interaction,
                {
                    embeds: [embed],
                }
            );
        }
    },
};
