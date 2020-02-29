var topicDB = require('../topic_database');
var TopicModel,
    instance;

TopicModel = function() {
  var self = this;

    /**
   * Process a term which is a topic
   *  either make a new node from that term if not exists
   *  else add backlink to it with the content and its id
   * @param term
   * @param slug
   * @param url
   * @param content of the journal entry
   * @param id of the journal entry
   * 
   */
  self.processTopic = function(term, slug, url, content, id) {
    console.info("ProcessTopic", term, slug);
    topicDB.get(slug, function(err, data) {
      //backlink to the journal entry
      var bl ="<a href=\"/journal/"+id+"\">"+content+"</a>";
      console.info('ProcessTopic-1', err, data);
      if (data) {
        topicDB.addBacklink(slug, bl, function(err) {
          console.info("ABL", err);
        });
      } else {
        var json = {};
        json.id = slug;
        json.label = term;
        json.date = new Date();
        json.urllist = [];
        if (url) {
          json.urllist.push(url);
        }
        json.backlinks = [];
        json.backlinks.push(bl);
        topicDB.put(json, function(err, dat) {
          console.info('ProceessTopic-2', err, dat);
        });
      }
    });
  };

  /**
   * Process a term which is a predicate - also a topic
   * @param predicate 
   * @param predicateSlug
   * @param subject 
   * @param subjectSlug
   * @param object 
   * @param objectSlug
   * @param url
   * @param content the journal entry itself
   * @param id the journal entry id
   */
  self.processPredicate = function(predicate, predicateSlug, 
                                   subject, subjectSlug,
                                   object, objectSlug,
                                   url,
                                   content, id) {
    console.info("ProcessPredicate", predicate, predicateSlug);
    topicDB.get(predicateSlug, function(err, data) {
      //backlink to the journal entry
      var bl ="<a href=\"/journal/"+id+"\">"+content+"</a>";
      console.info('ProcessPredicate-1', err, data);
      if (data) {
        topicDB.addBacklink(predicateSlug, bl, function(err) {
          console.info("BBL", err);
        });
      } else {
        var json = {};
        json.id = predicateSlug;
        json.label = predicate;
        json.date = new Date();
        json.source = "<a href=\"/topic/"+subjectSlug+"\">"+subject+"</a>"
        json.target = "<a href=\"/topic/"+objectSlug+"\">"+object+"</a>"
        json.sourceId = subjectSlug;
        json.targetId = objectSlug;
        json.backlinks = [];
        json.urllist = [];
        if (url) {
          json.urllist.push(url);
        }

        json.backlinks.push(bl);
        topicDB.put(json, function(err, dat) {
          console.info('ProcessPredicate-2', err, dat);
        });
      }
    });
  };

};

if (!instance) {
  instance = new TopicModel();
}
module.exports = instance;