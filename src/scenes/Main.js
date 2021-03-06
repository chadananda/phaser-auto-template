import { Player, Star } from '../sprites';
import { SCENES, TEXTURES } from '../constants';
import { Score } from '../texts';

const { Scene } = window.Phaser;

export default class Main extends Scene {
  constructor() {
    super({ key: SCENES.MAIN });
  }

  create() {
    const {
      game: {
        config: { height },
      },
      physics,
    } = this;

    // A simple background for our game.
    this.add.image(0, 0, TEXTURES.SKY).setOrigin(0);

    // The platforms group contains the ground and the 2 ledges we can jump on.
    // It's created after the background so the order of layers (z-depth) is
    // maintained (otherwise, the platforms will be hidden by the background).
    const platforms = physics.add.staticGroup({
      defaultKey: TEXTURES.GROUND,
    });

    // Create the ground (scale it to fit the widt of the game and scale it to
    // fit the width of the game). The original sprite is 400x32 in size.
    platforms
      .get(0, height - 64)
      .setOrigin(0)
      .setScale(2)
      .refreshBody();

    // Now let's create three ledges.
    [
      [600, 400],
      [50, 250],
      [750, 220],
    ].forEach(coordinates => {
      platforms.get(...coordinates);
    });

    // Create stars group.
    const stars = physics.add.group({
      classType: Star,
    });

    // Here we'll create 12 of them evenly spaced apart.
    for (let i = 0; i < 12; i++) {
      stars.get(i * 70, 0).init();
    }

    // Collide the star with the platform or else the star will fall through.
    physics.add.collider(stars, platforms);

    // Create player.
    const player = new Player(this, 32, height - 150).init();
    this.player = player;

    // Collide the player with the platform or else the player will fall through.
    physics.add.collider(player, platforms);

    // Check for overlap between the player and the star.
    physics.add.overlap(player, stars, this.collectStar, null, this);

    // Display score.
    this.score = 0;
    this.scoreText = new Score(this, 16, 16, this.score, {
      fill: '#fff',
      fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
      fontSize: 32,
    });
  }

  collectStar(player, star) {
    // Make the star inactive and invisible.
    star.disableBody(true, true);

    // Add to the score and update the text.
    this.score += 10;
    this.scoreText.setScore(this.score);
  }

  update(time, delta) {
    this.player.update();
  }
}
