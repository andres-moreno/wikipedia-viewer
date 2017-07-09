/* Use Wikipedia's API to develop a Wikipedia viewer. */
"use strict";

$(document).ready(function(){
    $.ajaxPrefilter( function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    /* getData Remove child nodes for the previous search (if any) and
       then query the wikipedia API for entries matching the search
       term

       Input: - term: the term for which we are searching Wikipedia
       articles

       Return: - None. This is an asynchronous function

       Side Effects: - A list of 10 matching terms (if any) have been
       appended to an unordered list in the HTML page. Otherwise we
       show nothing.
     */
    function getData(term){
        deleteChildNodesById("wikiLinks");
        getEntries(term);
    }

    /* if the users presses enter in the search box, then:
       - delete any child nodes from the list of search terms which
         might be there from a previous search
       - Populate the list with search terms/descriptions/links
     */
    $('#searchBox').keydown(function(e){
        if(e.keyCode == 13) {
            // to avoid multiple submissions
            $(this).attr("disabled", "disabled");
            getData(this.value);
            $(this).removeAttr("disabled");
        }
    });

    /* if the users presses the search icon in the search box, then:
       - delete any child nodes from the list of search terms which
       might be there from a previous search
       - Populate the list with search terms/descriptions/links
     */
    $("#searchIcon").on('click', function(){
        getData($('#searchBox').val());
    });

    // from Eloquent Javascript: build nodes
    function elt(type){
        var node = document.createElement(type);
        for (var i = 1; i < arguments.length; i++){
            var child = arguments[i];
            if (typeof child == "string") {
                child = document.createTextNode(child);
            }
            node.appendChild(child);
        }
        return node;
    }

    /* deleteChildNodesById(nodeID)
       Delete any child nodes from the node identified by nodeID. We
       use this function to delete the results of any previous search

       Parameters:
       - nodeID: a string with the id selector of the node

       Returns:
       - null

       Side Effects:
       - Child nodes, if any, will have been deleted
     */
    function deleteChildNodesById(nodeId) {
        var myNode = document.getElementById(nodeId);
        while (myNode.firstChild){
            myNode.removeChild(myNode.firstChild);
        }
    }

    var quoteURL = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&search=";

    function buildURL(term){
        return quoteURL + term;
    }

    /* getEntries:

       Get data from Wikipedia: terms, short explanations, URLs

       Parameters:
       - term: the search term to be submitted to wikipedia

       Returns:
       - Null--asynchronous call

       Side-effects:
       - Populates a list with 10 terms with descriptions and
       hyperlinks to the wikipedia article

       Note:
       - response[1] has the terms of search results
       - response[2] has a short description of the terms
       - response[3] has the web link
     */
    function getEntries(term) {
        $.getJSON(buildURL(term), function(response) {
            for (var i = 0; i < response[1].length; i++){
                // entry header and entry summary
                var internal = elt("li",
                                   elt("h2", response[1][i]),
                                   elt("p", response[2][i]));
                var myNode = elt("a", internal);
                // add web link in new tab with some styling
                myNode.href = response[3][i];
                myNode.target="_blank";
                myNode.classList.add("mb-5");
                myNode.classList.add("text-muted");
                document.getElementById("wikiLinks").appendChild(myNode);


            };
        });
    }
})
