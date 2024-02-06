using System.Collections.Generic;
using NPOI.Util;

namespace Assignment1.Entities
{
    public class User
    {
        public decimal UserId { get; set; }
        public int CurrentQuestionId { get; set; }
        
        public decimal CurrentScore { get; set; }
        public decimal CorrectQuestionCount { get; set; }
        public decimal CompleteQuestionCount { get; set; }

        public List<int> CompleteQuestionIdList { get; set; }

        public User()
        {
            UserId = 1;
            CurrentScore = 0;
            CorrectQuestionCount = 0;
            CompleteQuestionCount = 0;
            CompleteQuestionIdList = new List<int>();
        }

        /// <summary>
        /// check if user completed current question
        /// </summary>
        /// <param name="questionId"></param>
        /// <returns></returns>
        public bool IsCompleted(int questionId)
        {
            if (CompleteQuestionIdList == null)
            {
                return false;
            }

            return CompleteQuestionIdList.Exists(x => x == questionId);
        }

        /// <summary>
        /// update score
        /// </summary>
        private void AddScore()
        {
            CurrentScore ++;
        }

        /// <summary>
        /// update correct count
        /// </summary>
        private void AddCorrectCount()
        {
            CorrectQuestionCount++;
        }

        /// <summary>
        /// update complete question qty
        /// </summary>
        private void AddCompleteCount()
        {
            CompleteQuestionCount++;
        }

        /// <summary>
        /// add question id to list 
        /// </summary>
        private void AddCompleteQuestionId()
        {
            CompleteQuestionIdList.Add(CurrentQuestionId);
        }

        /// <summary>
        /// correction process
        /// </summary>
        public void Correction()
        {
            AddScore();
            AddCorrectCount();
            AddCompleteCount();
            AddCompleteQuestionId();
        }

        /// <summary>
        /// incorrection process
        /// </summary>
        public void Incorrection()
        {
            AddCompleteCount();
            AddCompleteQuestionId();
        }
    }
}