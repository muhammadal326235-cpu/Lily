import {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const accounts = require('../../../accounts.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('login')
        .setDescription('Login dan dapatkan hadiahnya.')
        .addStringOption(option =>
            option
                .setName('username')
                .setDescription('Masukkan username')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('password')
                .setDescription('Masukkan password')
                .setRequired(true)
        ),

    async execute(interaction) {
        const username = interaction.options.getString('username');
        const password = interaction.options.getString('password');

        if (!accounts[username]) {
            return interaction.reply({
                content: '❌ Username tidak ditemukan.',
                ephemeral: true
            });
        }

        if (accounts[username] !== password) {
            return interaction.reply({
                content: '❌ Password salah.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Login Berhasil')
            .setDescription(`Selamat anda berhasil masuk **${username}**`);

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
