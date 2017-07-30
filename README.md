# muzus
New conception of audio player for web. Based on [playeros](https://github.com/wcoder/playeros).

## Setup
```html
<!-- include muzus: js and css -->
<script src="dist/muzus.min.js"></script>
<link href="dist/muzus-default.css" rel="stylesheet"/>
```

### Available in NPM
```
TODO
```

## Basic Usage
Each link with `href` attribute and parent element class `muzus` automatically becomes a player for the linked MP3.

### Single track
```html
<section class="muzus">
    <a href="http://americanparanoia.com/AntiTrust%20-%20Guilty%20as%20Charged.mp3">Guilty as Charged</a>
</section>
```

### Playlists
```html
<section class="muzus">
    <a href="http://americanparanoia.com/AntiTrust%20-%20NoPrivacy.mp3">No Privacy</a>
    <a href="http://americanparanoia.com/AntiTrust%20-%20I%20am%20you.mp3">I am You</a>
    <a href="http://americanparanoia.com/AntiTrust%20-%20AntiSocial.mp3">Antisocial</a>
</section>
```
Check [muzus/example/index.html](https://github.com/wcoder/muzus/blob/master/example/index.html) to see more examples of usage.

## Advanced Features

### data-attributes
Adding some data-attributes changes the behavior or appearance of the player.

Attribute_Name | Type | Default value | Description
-------------- |:--:|:--:| --
`data-repeat` | `boolean` | `false` | Applied to a element with class `muzus`. Defines whether to repeat the playback after the last track is finished.



## Development

### Gulp

Install `gulp-cli`:
```
npm install --global gulp-cli
```

Restore development dependencies:
```
npm i --only=dev
```

### SCSS

Compiling:
```
gulp build:sass
```

Auto-compiling:
```
gulp sass:watch
```

## Contributions

*
*

## License

[MIT License](https://github.com/wcoder/muzus/blob/master/LICENSE)
