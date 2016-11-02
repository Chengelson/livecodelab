var parser  = require('../../src/generated/parser');
var ast     = require('../../src/js/lcl/ast').Node;

var dedent = require('dentist').dedent;

exports.programdata = {

  'lazy closure is parsed': function (test) {

    var program = `foo = <box 3, 4>`;
    var parsed = parser.parse(
      program, {
        functionNames: ['box'],
        inlinableFunctions: ['box']
      });

    var expected = ast.Block([
      ast.Assignment(
        'foo',
        ast.Closure(
          [],
          ast.Block([
            ast.Application(
                'box',
                [ast.Num(3), ast.Num(4)],
                null
            )
          ]),
          true
        )
      )
    ]);

    test.deepEqual(parsed, expected);
    test.done();
  },

  'lazy closure is created and used': function (test) {

    var program = dedent(`
                         foo = <box 3, 4>
                         rotate
                         \tfoo
                         `);
    var parsed = parser.parse(
      program, {
        functionNames: ['rotate', 'box'],
        inlinableFunctions: ['rotate', 'box']
      });

    var expected = ast.Block([
      ast.Assignment(
        'foo',
        ast.Closure(
          [],
          ast.Block([
            ast.Application(
                'box',
                [ast.Num(3), ast.Num(4)],
                null
            )
          ]),
          true
        )
      ),
      ast.Application(
        'rotate',
        [],
        ast.Block([
          ast.Application('foo', [], null)
        ])
      )
    ]);

    test.deepEqual(parsed, expected);
    test.done();
  },

  'lazy closure is inlinable': function (test) {

    var program = dedent(`
                         bigger = <scale 1.1>
                         rotate bigger box
                         `);
    var parsed = parser.parse(
      program, {
        functionNames: ['rotate', 'box', 'scale'],
        inlinableFunctions: ['rotate', 'box', 'scale']
      });

    var expected = ast.Block([
      ast.Assignment(
        'bigger',
        ast.Closure(
          [],
          ast.Block([ast.Application('scale', [ast.Num(1.1)], null)]),
          true
        ),
        true
      ),
      ast.Application(
        'rotate',
        [],
        ast.Block([
          ast.Application(
            'bigger',
            [],
            ast.Block([ast.Application('box', [], null)])
          )
        ])
      )
    ]);

    test.deepEqual(parsed, expected);
    test.done();
  }

};
