![MUZUS](https://wcoder.github.io/muzus/muzus-logo.svg)

New conception of audio player for web.

## Setup

```html
<!-- include muzus: js and css -->
<link href="dist/muzus.min.css" rel="stylesheet"/>
<script src="dist/muzus.min.js"></script>
```

### Available in NPM

```
npm install muzus
```

#### Getting the library from CDN

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/muzus/1.0.0/muzus.min.js"></script>
```

```html
<script src="//cdn.jsdelivr.net/npm/muzus@1.0.0/dist/muzus.min.js"></script>
```

## Basic Usage

Each link with `href` attribute and parent element class `muzus` automatically becomes a player for the linked MP3.

### Single track

```html
<section class="muzus">
    <a href="https://....mp3">Track name</a>
</section>
```

### Playlists

```html
<section class="muzus">
    <a href="https://....mp3">Track name 1</a>
    <a href="https://....mp3">Track name 2</a>
    <a href="https://....mp3">Track name 3</a>
</section>
```

Check [muzus/example/index.html](https://github.com/wcoder/muzus/blob/master/example/index.html) to see more examples of usage.

## Advanced Features

### data-attributes

Adding some data-attributes changes the behavior or appearance of the player.

Attribute_Name | Type | Default value | Description
-------------- |:--:|:--:| --
`data-repeat` | `boolean` | `false` | Applied to a element with class `muzus`. Defines whether to repeat the playback after the last track is finished.

### Preload options of script

Adding in `<head>` your page, if you need setup player before initialize. Define in global object `Muzus`. [[Example]](https://github.com/wcoder/muzus/blob/master/example/index.html#L21)

Option | Type | Default Value | Description
-- | -- | -- | --
`autoInit` | `boolean` | `true` | Defines automatically initialize player after page loaded.
`isMobile` | `function` | + | Defines custom function for check is mobile device use.

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

### Run example

```
npm run dev
```

## License

&copy; 2017 Yauheni Pakala | [MIT License](https://github.com/wcoder/muzus/blob/master/LICENSE)
