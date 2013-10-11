//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];
            var isWin = data.ext["is_win"];
            var ghostMove = data.ext["ghost_move"];
            var stephanMove = data.ext["stephan_move"];
            var struckWall = data.ext["wall"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            var call = JSON.stringify(checkioInput[0]) + ", " + JSON.stringify(checkioInput[1]) + ", " + JSON.stringify(checkioInput[2]);

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + call + ')');
                $content.find('.answer').html(JSON.stringify(result_addon));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + call + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var canvas = new HauntedHouseCanvas($content.find(".explanation")[0]);
            canvas.createCanvas(checkioInput[0], checkioInput[1], checkioInput[2]);
            canvas.animateCanvas(stephanMove, ghostMove, struckWall);

            this_e.setAnimationHeight($content.height() + 60);

        });

       

        var colorOrange4 = "#F0801A";
        var colorOrange3 = "#FA8F00";
        var colorOrange2 = "#FAA600";
        var colorOrange1 = "#FABA00";

        var colorBlue4 = "#294270";
        var colorBlue3 = "#006CA9";
        var colorBlue2 = "#65A1CF";
        var colorBlue1 = "#8FC7ED";

        var colorGrey4 = "#737370";
        var colorGrey3 = "#9D9E9E";
        var colorGrey2 = "#C5C6C6";
        var colorGrey1 = "#EBEDED";

        var colorWhite = "#FFFFFF";

        var ghostPath = "M9.229,-4.689 C9.483,-4.925 9.605,-5.2 9.605,-5.524 C9.605,-5.85 9.483,-6.125 9.229,-6.352 C8.975,-6.58 8.671,-6.693 8.321,-6.693 C7.97,-6.693 7.673,-6.58 7.437,-6.352 C7.191,-6.125 7.069,-5.85 7.069,-5.524 C7.069,-5.2 7.191,-4.925 7.437,-4.689 C7.673,-4.454 7.97,-4.341 8.321,-4.341 C8.671,-4.341 8.975,-4.454 9.229,-4.689 z M3.379,-5.752 C3.634,-5.979 3.764,-6.256 3.764,-6.58 C3.764,-6.904 3.634,-7.181 3.379,-7.408 C3.126,-7.636 2.829,-7.749 2.48,-7.749 C2.13,-7.749 1.831,-7.636 1.587,-7.408 C1.344,-7.181 1.22,-6.904 1.22,-6.58 C1.22,-6.256 1.342,-5.979 1.587,-5.752 C1.831,-5.524 2.13,-5.411 2.48,-5.411 C2.829,-5.411 3.126,-5.524 3.379,-5.752 z M-10.408,-8.872 C-9.825,-9.239 -7.941,-9.21 -7.549,-9.145 C-5.485,-8.804 -2.094,-6.003 -0.326,-8.397 C0.643,-9.705 2.987,-13.155 4.806,-14.054 C6.624,-14.955 9.089,-14.429 10.341,-13.04 C12.998,-10.093 11.047,-7.368 11.67,-5.281 C11.87,-4.608 12.683,-4.422 13.33,-4.68 C13.97,-4.949 16.278,-6.555 17.405,-6.823 C18.533,-7.083 20.674,-7.157 21.524,-5.436 C22.371,-3.707 22.86,-0.599 23.263,2.551 C23.665,5.699 23.498,7.272 23.186,7.687 C22.86,8.102 22.109,9.204 20.719,8.028 C19.319,6.842 18.654,6 17.773,6.673 C16.757,7.443 14.388,12.906 12.437,10.95 C11.468,9.975 10.235,8.701 8.985,9.975 C7.734,11.25 6.702,13.945 5.976,14.659 C5.251,15.374 3.266,16.273 2.016,14.318 C0.765,12.369 -0.44,12.475 -1.21,12.858 C-1.98,13.245 -3.431,14.886 -4.569,14.058 C-5.696,13.238 -6.054,12.256 -6.466,11.063 C-6.868,9.862 -7.96,9.521 -9.492,10.162 C-11.03,10.795 -12.962,11.436 -13.486,9.302 C-14.378,5.674 -21.199,10.503 -21.487,8.475 C-21.867,5.77 -13.501,-6.925 -10.408,-8.872";

        function HauntedHouseCanvas(dom) {
            var cell = 60;
            var numbSize = cell * 0.5;
            var N = 4;
            var delay = 300;

            var fullSizeX = (N + 2) * cell;
            var fullSizeY = (N + 2) * cell;

            var paper = Raphael(dom, fullSizeX, fullSizeY, 0, 0);
            var stephan = paper.set();
            var ghost = paper.set();

            var attrStephan = {"stroke": colorBlue4, "stroke-width": 4, "fill": colorOrange4};
            var attrGhost = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorOrange4};
            var attrCell = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorBlue1};
            var attrNumb = {"stroke": colorBlue2, "fill": colorBlue2,
                "font-family": "Verdana", "font-size": numbSize, "font-weight": "bold"};
            var attrNumbS = {"stroke": colorBlue4, "fill": colorBlue4,
                "font-family": "Verdana", "font-size": cell * 0.4, "font-weight": "bold"};
            var attrWall = {"stroke": colorBlue4, "stroke-width": 5, "stroke-linecap": "round"};

            var walls = {
                "N": [0, 0, cell, 0],
                "S": [0, cell, cell, cell],
                "W": [0, 0, 0, cell],
                "E": [cell, 0, cell, cell]
            };
            var dirs = {
                "N": [0, -cell],
                "S": [0, cell],
                "W": [-cell, 0],
                "E": [cell, 0]
            };


            this.createCanvas = function(house, st, gh) {
                paper.rect(
                        cell,
                        0,
                        cell, cell
                    ).attr(attrCell).attr("fill", colorOrange1);
                paper.text(
                        1.5 * cell,
                        0.5 * cell,
                        "E"
                    ).attr(attrNumb).attr("fill", colorOrange4);

                paper.text(
                        fullSizeX / 2,
                        0.5 * cell,
                        "N"
                    ).attr(attrNumb);

                paper.text(
                        fullSizeX / 2,
                        fullSizeY - 0.5 * cell,
                        "S"
                    ).attr(attrNumb);

                paper.text(
                        0.5 * cell,
                        fullSizeY / 2,
                        "W"
                    ).attr(attrNumb);

                paper.text(
                        fullSizeX - 0.5 * cell,
                        fullSizeY / 2,
                        "E"
                    ).attr(attrNumb);

                for (var i = 0; i < 16; i++){
                    var row = Math.floor(i / 4) + 1;
                    var col = (i % 4) + 1;
                    var r = paper.rect(
                        col * cell,
                        row * cell,
                        cell, cell
                    ).attr(attrCell);
                    r.toBack();
                    paper.text(
                        (col + 0.5) * cell,
                        (row + 0.5) * cell,
                        i + 1
                    ).attr(attrNumb);
                    for (var j = 0; j < house[i].length; j++) {
                        var correction = walls[house[i][j]];
                        paper.path(Raphael.format("M{0},{1}L{2},{3}",
                            col * cell + correction[0],
                            row * cell + correction[1],
                            col * cell + correction[2],
                            row * cell + correction[3]
                        )).attr(attrWall);
                    }
                    if (i + 1 === st) {
                        stephan.push(paper.circle(
                            (col + 0.5) * cell,
                            (row + 0.5) * cell,
                            cell / 3
                        ).attr(attrStephan));
                        stephan.push(paper.text(
                            (col + 0.5) * cell,
                            (row + 0.5) * cell,
                            "S"
                        ).attr(attrNumbS));
                    }
                    if (i + 1 === gh) {
                        ghost = paper.path(ghostPath).attr(attrGhost);
                        ghost.transform("t" + ((col + 0.5) * cell) + "," + (row + 0.5) * cell);
//                        ghost.push(paper.circle(
//                            (col + 0.5) * cell,
//                            (row + 0.5) * cell,
//                            cell / 3
//                        ).attr(attrStephan));
//                        ghost.push(paper.text(
//                            (col + 0.5) * cell,
//                            (row + 0.5) * cell,
//                            "G"
//                        ).attr(attrNumbS));
                    }
                }
            };

            this.animateCanvas =function(stM, ghM, struck) {
                stephan.toFront();
                ghost.toFront();
                if (stM) {
                    var k = struck ? 6 : 1;
                    stephan.animate({"transform": "t" + (dirs[stM][0] / k) + "," + (dirs[stM][1] / k)}, delay / k,
                        callback=function(){
                            if (ghM) {
                                ghost.animate({"transform": "...t" + dirs[ghM][0] + "," + dirs[ghM][1]}, delay);
                            }
                    });
                }
            }
        }


    }
);
