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


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            var call = JSON.stringify(checkioInput[0]) + ", " + JSON.stringify(checkioInput[1]) + ", " + JSON.stringify(checkioInput[1]);

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
            canvas.animateCanvas(stephanMove, ghostMove);

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
                        ghost.push(paper.circle(
                            (col + 0.5) * cell,
                            (row + 0.5) * cell,
                            cell / 3
                        ).attr(attrStephan));
                        ghost.push(paper.text(
                            (col + 0.5) * cell,
                            (row + 0.5) * cell,
                            "G"
                        ).attr(attrNumbS));
                    }
                }
            };

            this.animateCanvas =function(stM, ghM) {
                ghost.toFront();
                stephan.toFront();
                if (stM) {
                    stephan.animate({"transform": "t" + dirs[stM][0] + "," + dirs[stM][1]}, delay,
                        callback=function(){
                            if (ghM) {
                                ghost.animate({"transform": "t" + dirs[ghM][0] + "," + dirs[ghM][1]}, delay);
                            }
                    });
                }
            }
        }


    }
);
