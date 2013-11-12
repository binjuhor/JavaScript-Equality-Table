// Generated by CoffeeScript 1.6.3
(function() {
  var ForComparison, isObject, isString, rotateText, supportsCanvas, values;

  isString = function(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
  };

  isObject = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  };

  ForComparison = (function() {
    function ForComparison(item) {
      var match, mtch;
      this.item = item;
      /*
      The goal here is to get a string that evaluates to the desired
      value. This string is set to object.asString
      
      For complicated cases which can't be passed in JSON the value
      can be passed as a string wrapped in backticks which is evaluated
      here.
      example: "`parseFloat("nan")`" means NaN.
      */

      this.asString = "" + this.item;
      if (isString(this.item)) {
        if (this.item.length > 0 && (mtch = this.item.match(/^`(.*)`$/))) {
          match = mtch[1];
          this.item = new Function("return " + match)();
          if (isString(this.item)) {
            this.asString = JSON.stringify(this.item);
          } else if (this.item === undefined) {
            this.asString = "undefined";
          } else if (isObject(this.item)) {
            this.asString = JSON.stringify(this.item);
          } else if (isNaN(this.item)) {
            this.asString = "NaN";
          } else {
            this.asString = JSON.stringify(this.item);
          }
        } else if (this.item.length === 0) {
          this.asString = '""';
        }
      } else if (this.item.toString() === "[object Object]") {
        this.asString = "{}";
      } else if (this.item instanceof Array) {
        this.asString = JSON.stringify(this.item);
      }
    }

    ForComparison.prototype.testResults = function(fc2, comparator) {
      var evalStr;
      if (comparator == null) {
        comparator = "===";
      }
      if (this.asString === "{}") {
        evalStr = "[" + this.asString + comparator + fc2.asString + "][0]";
      } else {
        evalStr = "" + this.asString + comparator + fc2.asString;
      }
      return [evalStr, eval(evalStr)];
    };

    ForComparison.prototype.toString = function() {
      return this.asString;
    };

    return ForComparison;

  })();

  /*
  The values which are strings wrapped in backticks (`) are evaluated
  before being compared.
  */


  values = [true, false, 1, 0, -1, "`'true'`", "`'false'`", "`'1'`", "`'0'`", "`'-1'`", "", "`null`", "`undefined`", "`[]`", "`{}`", [[]], [0], [1], "`parseFloat('nan')`"];

  (function() {
    var testRepr;
    testRepr = function(what, shouldBe) {
      var fc;
      fc = new ForComparison(what);
      if (fc.toString() !== shouldBe) {
        throw new Error("Value is not being represented correctly.");
      }
    };
    testRepr(true, "true");
    testRepr(false, "false");
    testRepr(1, "1");
    testRepr(0, "0");
    testRepr(-1, "-1");
    testRepr("`'true'`", "\"true\"");
    testRepr("`'false'`", "\"false\"");
    testRepr("`'1'`", "\"1\"");
    testRepr("`'0'`", "\"0\"");
    testRepr("`'-1'`", "\"-1\"");
    testRepr("", "\"\"");
    testRepr("`null`", "null");
    testRepr("`undefined`", "undefined");
    testRepr("`[]`", "[]");
    testRepr("`{}`", "{}");
    testRepr([[]], "[[]]");
    testRepr([0], "[0]");
    testRepr([1], "[1]");
    return testRepr("`parseFloat('nan')`", "NaN");
  })();

  (function() {
    var testEquality;
    testEquality = function(tf, item, comparator) {
      var fc1;
      fc1 = new ForComparison(item);
      if (fc1.testResults(fc1, comparator)[1] !== tf) {
        throw new Error("Condition should be " + tf);
      }
    };
    testEquality(true==true, "`true`", "==");
    testEquality([[]]==[[]], "`[[]]`", "==");
    return testEquality([]==[], "`[]`", "==");
  })();

  supportsCanvas = (function() {
    var el;
    el = document.createElement("canvas");
    return !!(el.getContext && el.getContext("2d"));
  })();

  this.buildComparisonTable = function(values, comparator) {
    var $el, $headRow, $table, $tr, comp, comps, evalStr, td, tf, v, valX, valY, x, y, _i, _j, _k, _len, _len1, _len2, _ref;
    comps = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        v = values[_i];
        _results.push(new ForComparison(v));
      }
      return _results;
    })();
    $table = $("<table>", {
      "class": "comparisons"
    });
    $headRow = $("<tr>").append("<td>").appendTo($table);
    for (_i = 0, _len = comps.length; _i < _len; _i++) {
      comp = comps[_i];
      $el = supportsCanvas ? rotateText(comp.asString) : $("<span>", {
        "class": "rotate",
        text: comp.asString
      });
      $("<td>", {
        "class": "header col"
      }).html($el).appendTo($headRow);
    }
    for (x = _j = 0, _len1 = comps.length; _j < _len1; x = ++_j) {
      valX = comps[x];
      $tr = $("<tr>").appendTo($table);
      $("<td>", {
        "class": "row header"
      }).text(valX.asString).appendTo($tr);
      for (y = _k = 0, _len2 = comps.length; _k < _len2; y = ++_k) {
        valY = comps[y];
        td = $("<td>", {
          "class": "cell",
          html: "<div>&nbsp;</div>"
        }).appendTo($tr);
        _ref = valX.testResults(valY, comparator), evalStr = _ref[0], tf = _ref[1];
        td.attr("title", "" + evalStr + " // " + tf);
        if (tf) {
          td.addClass("green");
        }
      }
    }
    return $table;
  };

  this.buildUnifiedComparisonTable = function(values) {
    var $el, $headRow, $table, $tr, comps, evalStr2, evalStr3, exprClass, r2, r3, status, td, txt, v, valX, valY, x, y, _i, _j, _len, _len1, _ref, _ref1;
    comps = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        v = values[_i];
        _results.push(new ForComparison(v));
      }
      return _results;
    })();
    $table = $("<table>", {
      "class": "comparisons"
    });
    $headRow = $("<tr>").append("<td>").appendTo($table);
    for (x = _i = 0, _len = comps.length; _i < _len; x = ++_i) {
      valX = comps[x];
      $el = supportsCanvas ? rotateText(valX.asString) : $("<span>", {
        "class": "rotate",
        text: valX.asString
      });
      $("<td>", {
        "class": "header col"
      }).html($el).appendTo($headRow);
      $tr = $("<tr>").appendTo($table);
      exprClass = (function() {
        var val;
        val = (new Function("if(" + valX.asString + "){return true}else{return false}"))();
        if (val) {
          return "true";
        } else {
          return "false";
        }
      })();
      $("<td>", {
        "class": "row header " + exprClass
      }).text(valX.asString).append("<span>:</span>").appendTo($tr);
      for (y = _j = 0, _len1 = comps.length; _j < _len1; y = ++_j) {
        valY = comps[y];
        _ref = valX.testResults(valY, "=="), evalStr2 = _ref[0], r2 = _ref[1];
        _ref1 = valX.testResults(valY, "==="), evalStr3 = _ref1[0], r3 = _ref1[1];
        if (r2 && r3) {
          status = "strict-equality";
          txt = "=";
        } else if (r2) {
          status = "loose-equality";
          txt = "&#8773;";
        } else {
          status = "no-equality";
          txt = "&#8800;";
        }
        td = $("<td>", {
          "class": "cell",
          html: "<div>" + txt + "</div>"
        }).appendTo($tr);
        td.data("eval2", evalStr2);
        td.data("eval3", evalStr3);
        if (r2 && r3) {
          td.addClass("strict-equality");
        } else if (r2) {
          td.addClass("loose-equality");
        }
      }
    }
    return $table;
  };

  this.buildKeyTable = function() {
    var $table, rowc, rowdesc, rowicon, rows, rowtxt, td, tr, _i, _len, _ref;
    $table = $("<table>", {
      "class": "key comparisons"
    });
    rows = [["no-eq", "&#8800;", "Not equal"], ["loose-equality", "&#8773;", "Loose equality", "Often gives \"false\" positives like \"1\" is true; [] is \"0\""], ["strict-equality", "=", "Strict equality", "Mostly evaluates as one would expect."]];
    for (_i = 0, _len = rows.length; _i < _len; _i++) {
      _ref = rows[_i], rowc = _ref[0], rowicon = _ref[1], rowtxt = _ref[2], rowdesc = _ref[3];
      tr = $("<tr>").appendTo($table);
      $("<td>", {
        "class": "" + rowc + " cell"
      }).html("<div>" + rowicon + "</div>").appendTo(tr);
      td = $("<td>", {
        "class": "" + rowc + " label"
      }).html(rowtxt);
      if (rowdesc) {
        $("<p>", {
          "class": "desc",
          html: rowdesc
        }).appendTo(td);
      }
      td.appendTo(tr);
    }
    return $table;
  };

  rotateText = function(txt, cHeight) {
    var c, canv;
    if (cHeight == null) {
      cHeight = 80;
    }
    canv = document.createElement("canvas");
    canv.width = "25";
    canv.height = cHeight;
    c = canv.getContext("2d");
    c.rotate(Math.PI / 2);
    c.font = "15px Monospace";
    c.textAlign = "right";
    c.fillText(txt, cHeight, -10);
    return canv;
  };

}).call(this);
