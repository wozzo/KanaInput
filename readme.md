# jQuery KanaInput Plugin
The jQuery KanaInput plugin changes romaji (latin) characters to Japanese characters as you type in the same way as an IME would in your operating system.
The Japanese language consists of three written scripts called hiragana, katakana, and kanji. Hiragana and Katakana are syllabaries which can be converted to and from romaji. For example the Japanese word for Japan is にほん or nihon. In Hiragana this consists of 3 syllables; ni, ho, & n or に, ほ, & ん.
Many Japanese sites require a particular kana script to be entered, which would be dependent on the user having a Japanese IME installed, which may not always be the case. This plugin will automatically convert romaji to hiragana or katakana as required.

## Usage
KanaInput requires jQuery. We recommend using Google's CDN version using the code below or you can download it from [jQuery.com](jQuery.com).
The jQuery.kanaInput.js file should then be included afterwards. See below for example.

```
script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="jQuery.kanaInput.js"></script>
```

Create the text box you plan to and place it in the page where desired

`<input type="textbox" id="KanaInputBox" />`

Finally initialise the kanaInput with the following code in your jQuery ready function

`$("#KanaInputBox").kanaInput({});`

### Options
Two options are available, both are optional

#### defaultKana
Available options are 'hiragana' or 'katakana'. The default is hiragana.

#### shiftKana
If enabled when the shift key is used the alternative kana will be used. For example if the defaultKana is hiragana and the shift key is held whilst typing the output will be katakana.

## License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php). 
Basically you can use it as you see fit, but my name must remain in the code as it is at present. 