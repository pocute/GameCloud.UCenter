﻿using System.Runtime.Serialization;

namespace GameCloud.UCenter.Common.Portable.Models.AppClient
{
    [DataContract]
    public class AccountRequestResponse
    {
        [DataMember]
        public string AccountId { get; set; }

        [DataMember]
        public string AccountName { get; set; }

        [DataMember]
        public AccountStatus AccountStatus { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string ProfileImage { get; set; }

        [DataMember]
        public string ProfileThumbnail { get; set; }

        [DataMember]
        public Gender Gender { get; set; }

        [DataMember]
        public string IdentityNum { get; set; }

        [DataMember]
        public string PhoneNum { get; set; }

        [DataMember]
        public string Email { get; set; }

        public virtual void ApplyEntity(AccountResponse account)
        {
            this.AccountId = account.AccountId;
            this.AccountName = account.AccountName;
            this.AccountStatus = account.AccountStatus;
            this.Name = account.Name;
            this.ProfileImage = account.ProfileImage;
            this.ProfileThumbnail = account.ProfileThumbnail;
            this.Gender = account.Gender;
            this.IdentityNum = account.IdentityNum;
            this.PhoneNum = account.PhoneNum;
            this.Email = account.Email;
        }
    }
}