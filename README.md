# GitHub Stars Tagger (v1.0.0)
A Google Chrome extension that lets you add tags to your starred repositories directly on GitHub.

## About
I built this Chrome extension to fill a gap that has been frustrating me for some time now on GitHub.
There is currently no way (apart from filtering by language) to categorise/organise the repositories that you have starred.

There currently are external solutions to this issue such as:
* [astralapp.com](http://astralapp.com/): a separate site
* [Oh My Star](http://www.ohmystarapp.com/): a native application

However, what I wish is to create an experience as transparent as possible for the users, so that it feels like all the added functionality is native to GitHub's website.

## Limitations
Currently, the functionality is limited to the `/stars` page but I eventually want to bring a similar experience to individual repository pages.

There is also a hard limitation on the number of repositories you can add tags to which is `512` (should be fine for a while) as I am using [Chrome storage.sync](https://developer.chrome.com/extensions/storage#property-sync) as a mean to store the data (which is then neatly shared across your different computers).

I am tracking this limitation, should an issue arise.

## Contributing
Plese see [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## Licensing
MIT © 2015 [Benoît Grélard](http://www.artisologic.com)
