(function() {
  var ent, fs, getPlaylist, querystring, request;

  fs = require('fs');

  request = require('request');

  querystring = require('querystring');

  ent = require('ent');

  getPlaylist = function(id, genreId, callback) {
    var qs;
    qs = querystring.stringify({
      id: id,
      genreId: genreId,
      popId: 1
    });
    return request({
      url: "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewTop?" + qs,
      headers: {
        'User-Agent': 'iTunes/10.5.2 (Macintosh; Intel Mac OS X 10.7.2) AppleWebKit/534.52.7',
        'Accept-Language': 'ja-jp',
        'X-Apple-Store-Front': '143462-9,12'
      }
    }, function(error, response, body) {
      var duration, hit, list, rx;
      rx = /audio-preview-url="([^"]+)".*?preview-album="([^"]+)".*?preview-artist="([^"]+)".*?preview-title="([^"]+)".*?preview-duration="(\d+)"/g;
      list = (function() {
        var _results;
        _results = [];
        while (hit = rx.exec(body)) {
          duration = Math.floor(parseInt(hit[5]) / 1000);
          _results.push({
            url: ent.decode(hit[1]),
            album: ent.decode(hit[2]),
            artist: ent.decode(hit[3]),
            title: ent.decode(hit[4]),
            duration: Math.floor(parseInt(hit[5]) / 1000)
          });
        }
        return _results;
      })();
      return typeof callback === "function" ? callback(list) : void 0;
    });
  };

  exports.get = getPlaylist;

}).call(this);
