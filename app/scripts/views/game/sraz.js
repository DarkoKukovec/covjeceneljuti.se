/*global define*/

define([
  'app',
  'lodash',
  'backbone',
  'templates',
  'views/game/board',
  'views/abstract/zoom'
], function(
  app,
  _,
  Backbone,
  JST
) {
  'use strict';

  var SrazView = Backbone.View.extend({
    className: 'sraz-container',
    template: JST['app/scripts/templates/game/sraz.hbs'],

    events: {
      'click .answer-button': 'onAnswerClick'
    },

    questions: [
      {
        question: 'Who cut off Van Gogh\'s ear?',
        answer1: 'his father',
        answer2: 'his brother',
        answer3: 'he did',
        answer4: 'his grandfather',
        correct: 3
      },
      {
        question: 'Who painted the Mona Lisa?',
        answer1: 'Da Vinci',
        answer2: 'Michelangelo',
        answer3: 'Salvador Dali',
        answer4: 'Picasso',
        correct: 1
      },
      {
        question: 'What did the crocodile swallow in Peter Pan?',
        answer1: 'Peter Pans hat',
        answer2: 'alarm clock',
        answer3: 'an apple',
        answer4: 'Wendys shoe',
        correct: 2
      },
      {
        question: 'How many people went onto Noah\'s Ark?',
        answer1: '5',
        answer2: '8',
        answer3: '21',
        answer4: '42',
        correct: 2
      },
      {
        question: 'Who wrote the Ugly Duckling?',
        answer1: 'Grimm brothers',
        answer2: 'Oscar Wilde',
        answer3: 'Arthur Conan Doyle',
        answer4: 'Hans Christian Andersen',
        correct: 4
      }
    ],
    question: null,
    answered: false,

    render: function() {
      var random = Math.floor(Math.random() * this.questions.length);
      this.question = this.questions[random];
      this.$el.html(this.template(this.question));
      return this;
    },

    onAnswerClick: function(ev) {
      if (this.answered) {
        return;
      }
      this.answered = true;
      var me = this;
      var answer = parseInt($(ev.target).attr('data-index'), 10);
      var correct = answer === this.question.correct;
      this.$('.answer-' + answer).addClass('choosen-answer');
      this.$('.answer-' + this.question.correct).addClass('correct-answer');
      this.$(correct ? '.correct' : '.wrong').show();
      this.$(!correct ? '.correct' : '.wrong').hide();
      setTimeout(function() {
        me.trigger('answer', correct);
      }, 1500);
    }
  });

  return SrazView;
});
