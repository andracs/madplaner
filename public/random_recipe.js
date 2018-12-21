$(document).ready(function () {
    $.post("random/", function(data, status){
        $("#recipe_list").append("<a href=/recipe/single?recipe="+data+ " class='btn btn-default' id='random_recipe'>"+data+ "</a>");
    });
    var filtercount =1;
    $.post("/filters/viewall", function(data, status){
        data.forEach(function(element) {
            $("#filter_list").append("<label for='filter'>"+element+ "</label> <br>"+" <input type='checkbox' id='filter"+filtercount+"' name='filters' value='"+element+"'> <br>");
            filtercount++;
        });
    });

    var tagcount =1;
    $.post("/tag/viewall", function(data, status){
        data.forEach(function(element) {
            $("#tag_list").append("<label for='tag'>"+element+ "</label> <br>"+" <input type='checkbox' id='tag"+tagcount+"' name='tags' value='"+element+"'> <br>");
            tagcount++;
        });
    });

    $("#random_recipe_button").click(function() {
        var filters =[]
        for (let i = 1; i < filtercount; i++) {
            var filterselect=$("#filter"+i)
            if(filterselect.is(":checked")){
                filters.push( filterselect.val());
            }

        }

        var tags =[]

        for (let i = 1; i < tagcount; i++) {
            var tagselect=$("#tag"+i)
            if(tagselect.is(":checked")){
                tags.push( tagselect.val());
            }

        }
        //var filter1 = $("#filters").is(":checked")
        console.log(filters);
        console.log(tags);

        $.post("random/",{ filters: filters, tags:tags }, function(data, status){
            $("#random_recipe").remove();
            $("#recipe_list").append("<a href=/recipe/single?recipe="+data+ " class='btn btn-default' id='random_recipe'>"+data+ "</a>");
        });
    });
});