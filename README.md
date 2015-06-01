Emscripten flavour of game-music-emu
====================================

This can be considered a temporary fork while I work out the details of adding options to the CMake build system enabling an optional Emscripten build of the library. History is expected to be rewritten.

At the moment a very crude build can be accomplished via:

    $ em++ -O3 --bind -std=c++11 -o gme.js *.cpp

...in the 'gme' subdirectory.
