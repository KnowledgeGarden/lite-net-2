var slugUtil = require('../slug');
var JournalModel = require('./journal_model');

var Linker;
var instance;

Linker = function() {
  var self = this;
/*
  self.findSubject = function(triple) {
    var begin = triple.indexOf("[[")+2;
    var end = triple.indexOf("]]", begin);
    var result = triple.substring(begin, end);
    console.info("SUBJ", triple, result);
    return result;
  };

  self.findObject = function(triple) {
    var begin = triple.indexOf("[[")+2;
    begin = triple.indexOf("[[", begin)+2;
    var end = triple.indexOf("]]", begin);
    var result = triple.substring(begin, end);
    console.info("OBJ", triple, result);
    return result;
  };

  self.findPredicate = function(triple) {
    var begin = triple.indexOf("]]")+2;
    var end = triple.indexOf("[[", begin);
    var result = triple.substring(begin, end).trim();
    console.info("PRED", triple, result);
    return result;
  };
*/
  /**
   * Given a term --> topic,
   * create an href for it.
   * @param term 
   * @return href
   */
  self.getHref = function(term, slug) {
    
    var result = "<a href=\"/topic/"+slug+"\">"+term+"</a>";
    return result;
  };
  //////////////////////////////////
  // This is complex:
  // We are walking through a block of text to be added to a
  //  topic node. If we see a Wikilink, we must do the following:
  //  a) convert that term to an href
  //  b) fire up the backlink to this block of text
  //    which technically means that the block of text must have
  //    its own ID,
  //    OR,it means that this entire topic represents the backlink
  //
  //////////////////////////////////
  /**
   * Given some text, look for Wikilinks.
   * Where found, convert those to hrefs and reconstruct the
   * text including the hrefs.
   * Returns the revised text (with hrefs, if any) and a list
   * of topics and their slugs found, if any
   * @param text 
   * @param callback {data, topiclist}
   */
  self.resolveWikiLinks = function(text, callback) {
    var topiclist = []; // topic is a json object with label and slug
    var result = "";
    var begin = text.indexOf("[[");
    var end = 0;
    var term;
    var slug;
    var jsonT;
    while (begin > -1) {
      // add unused text to result
      result = text.substring(begin)+" ";
      begin += 2;
      end = text.indexOf("]]", begin);
      term = text.substring(begin, end).trim();
      slug = slugUtil.toSlug(term);
      // add href to result
      result += self.getHref(term)+" ";
      jsonT = {};
      jsonT.label = term;
      jsonT.slug = slug;
      topiclist.push(jsonT);
      begin = term.indexOf("[[");
      if (begin === -1 && (end +2) < text.length()) {
        //add remainder, if any
        result += text.substring(end+2);
      } else {
        //add gap from last end+2
        result += text.substring((end+2), begin)+" ";
      }
    }
    if (result === "") {
      result = text;
    }
    return callback(result.trim(), topiclist);
  };

  self.setHrefs = function(subject, sSlug, object, oSlug, predicate) {
    var result = "";
    var sHref = "<a href=\"/topic/"+sSlug+"\">"+subject+"</a>";
    var oHref = "<a href=\"/topic/"+oSlug+"\">"+object+"</a>";
    result += sHref+" ";
    result += predicate;
    result += " "+oHref;
    return result;
  };
};

if (!instance) {
  instance = new Linker();
}

module.exports = instance;