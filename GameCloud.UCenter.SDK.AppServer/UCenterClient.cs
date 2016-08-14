﻿using System.Net.Http;
using System.Threading.Tasks;
using GameCloud.UCenter.Common.Models.AppServer;
using GameCloud.UCenter.Common.SDK;

namespace GameCloud.UCenter.SDK.AppServer
{
    /// <summary>
    /// Provide a client class for UCenter.
    /// </summary>
    public class UCenterClient
    {
        private readonly string host;
        private readonly UCenterHttpClient httpClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="UCenterClient" /> class.
        /// </summary>
        /// <param name="host">Indicating the host address.</param>
        public UCenterClient(string host)
        {
            this.httpClient = new UCenterHttpClient();
            this.host = host;
        }

        /// <summary>
        /// Create application.
        /// </summary>
        /// <param name="info">Indicating the application information.</param>
        /// <returns>Async response.</returns>
        public async Task<AppResponse> CreateAppAsync(AppInfo info)
        {
            string url = this.GenerateApiEndpoint("app", "create");
            var response = await this.httpClient.SendAsyncWithException<AppInfo, AppResponse>(HttpMethod.Post, url, info);
            return response;
        }

        /// <summary>
        /// Create application.
        /// </summary>
        /// <param name="info">Indicating the application configuration information.</param>
        /// <returns>Async response.</returns>
        public async Task<AppResponse> CreateAppConfigurationAsync(AppConfigurationInfo info)
        {
            string url = this.GenerateApiEndpoint("appclient", "createconf");
            var response = await this.httpClient.SendAsyncWithException<AppConfigurationInfo, AppResponse>(HttpMethod.Post, url, info);
            return response;
        }

        /// <summary>
        /// verify application account.
        /// </summary>
        /// <param name="info">Indicating the application information.</param>
        /// <returns>Async response.</returns>
        public async Task<AccountLoginAppResponse> AccountLoginAppAsync(AccountLoginAppInfo info)
        {
            string url = this.GenerateApiEndpoint("app", "accountlogin");
            var response = await this.httpClient.SendAsyncWithException<AccountLoginAppInfo, AccountLoginAppResponse>(
                        HttpMethod.Post,
                        url,
                        info);

            return response;
        }

        /// <summary>
        /// read application data.
        /// </summary>
        /// <param name="info">Indicating the application information.</param>
        /// <returns>Async response.</returns>
        public async Task<AppAccountDataResponse> AppReadAccountDataAsync(AppAccountDataInfo info)
        {
            string url = this.GenerateApiEndpoint("app", "readdata");
            var response = await this.httpClient.SendAsyncWithException<AppAccountDataInfo, AppAccountDataResponse>(
                    HttpMethod.Post,
                    url,
                    info);

            return response;
        }

        /// <summary>
        /// Write application data.
        /// </summary>
        /// <param name="info">Indicating the application information.</param>
        /// <returns>Async response.</returns>
        public async Task<AppAccountDataResponse> AppWriteAccountDataAsync(AppAccountDataInfo info)
        {
            string url = this.GenerateApiEndpoint("app", "writedata");
            var response = await this.httpClient.SendAsyncWithException<AppAccountDataInfo, AppAccountDataResponse>(
                    HttpMethod.Post,
                    url,
                    info);

            return response;
        }

        private string GenerateApiEndpoint(string controller, string route, string queryString = null)
        {
            var url = $"{this.host}/api/{controller}/{route}";
            if (!string.IsNullOrEmpty(queryString))
            {
                url = $"{url}/?{queryString}";
            }

            return url;
        }
    }
}