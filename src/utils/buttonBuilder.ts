import { 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} from 'discord.js';

export function createMusicControlButtons(isPlaying: boolean = true) {
  // Row 1: Playback controls
  const row1 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      // Dynamic Play/Pause button based on state
      isPlaying 
        ? new ButtonBuilder()
            .setCustomId('music_pause')
            .setLabel('Pause')
            .setEmoji('⏸️')
            .setStyle(ButtonStyle.Primary)
        : new ButtonBuilder()
            .setCustomId('music_resume')
            .setLabel('Resume')
            .setEmoji('▶️')
            .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('music_skip')
        .setLabel('Skip')
        .setEmoji('⏭️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('music_stop')
        .setLabel('Stop')
        .setEmoji('⏹️')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('music_queue')
        .setLabel('Queue')
        .setEmoji('📜')
        .setStyle(ButtonStyle.Secondary)
    );

  // Row 2: Volume & Loop controls
  const row2 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('music_volume_down')
        .setLabel('Vol -')
        .setEmoji('🔉')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('music_volume_up')
        .setLabel('Vol +')
        .setEmoji('🔊')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('music_loop')
        .setLabel('Loop')
        .setEmoji('🔁')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('music_shuffle')
        .setLabel('Shuffle')
        .setEmoji('🔀')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('music_autoplay')
        .setLabel('Auto-play')
        .setEmoji('🎵')
        .setStyle(ButtonStyle.Secondary)
    );

  return [row1, row2];
}

export function createQueueNavigationButtons(currentPage: number, totalPages: number) {
  const row = new ActionRowBuilder<ButtonBuilder>();

  // Previous button
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`queue_prev_${currentPage}`)
      .setLabel('Previous')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === 1)
  );

  // Page indicator (disabled button for display)
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('queue_page_info')
      .setLabel(`Page ${currentPage}/${totalPages}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );

  // Next button
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`queue_next_${currentPage}`)
      .setLabel('Next')
      .setEmoji('➡️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === totalPages)
  );

  return [row];
}

export function createNowPlayingButtons(isPlaying: boolean, autoplayEnabled: boolean) {
  const row = new ActionRowBuilder<ButtonBuilder>();

  // Play/Pause toggle
  if (isPlaying) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('music_pause')
        .setLabel('Pause')
        .setEmoji('⏸️')
        .setStyle(ButtonStyle.Primary)
    );
  } else {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('music_resume')
        .setLabel('Resume')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Success)
    );
  }

  // Skip button
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('music_skip')
      .setLabel('Skip')
      .setEmoji('⏭️')
      .setStyle(ButtonStyle.Primary)
  );

  // Auto-play status
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('music_autoplay')
      .setLabel(autoplayEnabled ? 'Auto-play: ON' : 'Auto-play: OFF')
      .setEmoji('🎵')
      .setStyle(autoplayEnabled ? ButtonStyle.Success : ButtonStyle.Secondary)
  );

  // Queue button
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('music_queue')
      .setLabel('Queue')
      .setEmoji('📜')
      .setStyle(ButtonStyle.Secondary)
  );

  return [row];
}

