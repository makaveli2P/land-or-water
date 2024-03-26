# Land-or-Water

I came across [this](https://github.com/vnglst/pong-wars?tab=readme-ov-file) cool looking repository and had an idea to create my own version.

## How it Works

1. Open the `index.html` file in a web browser.
2. The game will start automatically, with two balls (green for land and blue for water) bouncing around the globe.
3. The globe is divided into tiles, with one half initially representing land (shades of green and brown) and the other half representing water (shades of blue).
4. When a ball collides with a tile of the opposite territory, the tile's color changes to the ball's color (either a land or water shade).
5. The land and water scores at the bottom of the screen indicate the current area captured by each territory.
6. The page background color will change dynamically based on which territory (land or water) is currently dominating.
7. The game continues indefinitely until you decide to stop or refresh the page.


https://github.com/makaveli2P/land-or-water/assets/54131539/003a5b4e-3d8a-48d7-bdfe-e7cf8c9ca39e

## How to Customize

You can easily customize various aspects of the game by modifying the JavaScript code:

1. **Color Palette**: Adjust the color shades for land and water tiles by modifying the `colorPalette` object in the code.
2. **Square Size**: Change the size of the tiles by modifying the `SQUARE_SIZE` constant.
3. **Ball Speed**: Adjust the minimum and maximum ball speeds by modifying the `MIN_SPEED` and `MAX_SPEED` constants.
4. **Ball Colors**: Change the colors of the land and water balls by modifying the `LAND_BALL_COLOR` and `WATER_BALL_COLOR` constants.

## Some maps!
<div align="center">
  <div style="display: flex; justify-content: center; align-items: flex-start;">
    <div style="margin-right: 20px;">
      <img src="https://github.com/makaveli2P/land-or-water/assets/54131539/9ee5e542-a528-4ab0-b030-980d7999b44b" width="400" />
      <img src="https://github.com/makaveli2P/land-or-water/assets/54131539/118519b0-44fc-4505-bab1-8aadd8234ece" width="400" />
    </div>
    <img src="https://github.com/makaveli2P/land-or-water/assets/54131539/697aa1a3-7870-42e5-a13b-00b00be15fcb" width="200" />
    <img src="https://github.com/makaveli2P/land-or-water/assets/54131539/a45c6b88-d104-4ef9-a18c-b91cd5f24bc7" width="200" />
  </div>
</div>
