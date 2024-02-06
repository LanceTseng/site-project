using System;

namespace Assignment1
{
    public class QuestionSequence
    {
        /// <summary>
        /// random get question id
        /// </summary>
        /// <param name="questionMin"></param>
        /// <param name="questionMax"></param>
        /// <returns></returns>
        public int GetQuestion(int questionMin = 1, int questionMax = 40)
        {
            return new Random().Next(questionMin, questionMax);
        }
    }
}