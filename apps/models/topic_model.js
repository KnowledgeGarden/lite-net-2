var topicDB = require('../topic_database');
var TopicModel,
    instance;

TopicModel = function() {
  var self = this;

    /**
   * Process a term 
   *  either make a new node from that term if not exists
   *  else add backlink to it with the content and its id
   * @param term
   * @param slug
   * @param content of the journal entry
   * @param id of the journal entry
   * 
   */
  self.processTopic = function(term, slug, content, id) {
    topicDB.get(slug, function(err, data) {
      //backlink to the journal entry
      var bl ="<a href=\"/journal/"+id+"\">"+content+"</a>";
      console.info('ProcessNode', err, data);
      if (data) {
        topicDB.addBacklink(slug, bl, function(err) {
          console.info("ABL", err);
        });
      } else {
        var json = {};
        json.id = slug;
        json.label = term;
        json.date = new Date();
        json.backlinks = [];
        json.backlinks.push(bl);
        topicDB.put(json, function(err, dat) {
          console.info('ProceessNode-1', err, dat);
        });
      }
    });
  };

};

if (!instance) {
  instance = new TopicModel();
}
module.exports = instance;