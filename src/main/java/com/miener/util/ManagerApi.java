package com.miener.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;

public class ManagerApi {

    private static final String apiUrl = "https://smartami.kr:18513/api";
    private static final String workApiUrl = "https://www.egservice.co.kr:18613/api";


    public static HashMap<String, Object> getDcuInfo(String SeqDcu) {

        String targetUrl = apiUrl + "/GetDcuInfo";
        String parameters = "SeqDcu=" + SeqDcu;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> GetSiteCount() {

        String targetUrl = apiUrl + "/GetSiteCount";

        return sendPost(targetUrl, "");
    }


    public static HashMap<String, Object> GetSiteList() throws Exception {

        String targetUrl = apiUrl + "/GetSiteList";

        return sendPost(targetUrl, "");
    }


    public static HashMap<String, Object> GetAppRequestCount(String SeqSite) throws Exception {

        String targetUrl = apiUrl + "/GetAppRequestCount";
        String parameters = "SeqSite=" + SeqSite;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetAppRequestListForPaging(String SeqSite, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetAppRequestListForPaging";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetKpxRequestListForPaging(String SeqSite, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetKpxRequestListForPaging";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetKnDrRequestListForPaging(String SeqSite, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetKnDrRequestListForPaging";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> GetSiteListForPaging(int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetSiteListForPaging";
        String parameters = "IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetSiteListForPagingLight(int IndexFrom, int IndexTo) {

        String targetUrl = apiUrl + "/GetSiteListForPagingLight";
        String parameters = "IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getDongHoCount(String SeqDong) throws Exception {

        String targetUrl = apiUrl + "/GetDongHoCount";
        String parameters = "SeqDong=" + SeqDong;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getHoCountByDong(String SeqDong) throws Exception {

        String targetUrl = workApiUrl + "/GetHoCountByDong";
        String parameters = "SeqDong=" + SeqDong;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getHoCountBySite(String SeqSite) throws Exception {

        String targetUrl = workApiUrl + "/GetHoCountBySite";
        String parameters = "SeqSite=" + SeqSite;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetHoListByDongFinalForPaging(String SeqDong, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetHoListByDongFinalForPaging";
        String parameters = "SeqDong=" + SeqDong;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getHoListBySiteForPaging(String SeqSite, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = workApiUrl + "/GetHoListBySiteForPaging";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetHoListByDong(String SeqDong) throws Exception {

        String targetUrl = apiUrl + "/GetHoListByDong";
        String parameters = "SeqDong=" + SeqDong;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetUsageListHourly(String SeqAptHo, String DateTarget) throws Exception {

        String targetUrl = apiUrl + "/GetUsageListHourly";
        String parameters = "SeqAptHo=" + SeqAptHo;
        parameters += "&DateTarget=" + DateTarget;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getHoInfo(String SeqHo) throws Exception {

        String targetUrl = workApiUrl + "/GetHoInfo";
        String parameters = "SeqHo=" + SeqHo;

        return sendPost(targetUrl, parameters);
    }

    //mdms
    public static HashMap<String, Object> getMdmsCount() throws Exception {

        String targetUrl = apiUrl + "/GetMdmsCount";

        return sendPost(targetUrl, "");
    }


    public static HashMap<String, Object> getMdmsListForPaging(int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetMdmsListForPaging";
        String parameters = "IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getCompanyCount() throws Exception {

        String targetUrl = apiUrl + "/GetCompanyCount";

        return sendPost(targetUrl, "");
    }

    public static HashMap<String, Object> getCompanyListForPaging(int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetCompanyListForPaging";
        String parameters = "IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getSiteListByMdms(String SeqMdms) throws Exception {

        String targetUrl = apiUrl + "/GetSiteListByMdms";
        String parameters = "SeqMdms=" + SeqMdms;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getDcuCount(String SeqMdms, String SeqSite) throws Exception {

        String targetUrl = apiUrl + "/GetDcuCount";

        String parameters = "SeqMdms=" + SeqMdms;
        parameters += "&SeqSite=" + SeqSite;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getDcuListForPaging(String SeqMdms, String SeqSite, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetDcuListForPaging";
        String parameters = "SeqMdms=" + SeqMdms;
        parameters += "&SeqSite=" + SeqSite;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getModemCount(String SeqSite, String SeqDong, String SeqDcu) throws Exception {

        String targetUrl = apiUrl + "/GetModemCount";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&SeqDong=" + SeqDong;
        parameters += "&SeqDcu=" + SeqDcu;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getModemListForPaging(String SeqSite, String SeqDong, String SeqDcu, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetModemListForPaging";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&SeqDong=" + SeqDong;
        parameters += "&SeqDcu=" + SeqDcu;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getDongListBySite(String SeqSite) throws Exception {

        String targetUrl = apiUrl + "/GetDongListBySite";
        String parameters = "SeqSite=" + SeqSite;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getDcuListBySite(String SeqSite) throws Exception {

        String targetUrl = apiUrl + "/GetDcuListBySite";
        String parameters = "SeqSite=" + SeqSite;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getMeterCount(String SeqSite, String SeqDong, String SeqDcu) throws Exception {

        String targetUrl = apiUrl + "/GetMeterCount";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&SeqDong=" + SeqDong;
        parameters += "&SeqDcu=" + SeqDcu;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getMeterListForPaging(String SeqSite, String SeqDong, String SeqDcu, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetMeterListForPaging";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&SeqDong=" + SeqDong;
        parameters += "&SeqDcu=" + SeqDcu;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getUsageListDaily(String SeqAptHo, String DateFrom, String DateTo) throws Exception {

        String targetUrl = apiUrl + "/GetUsageListDaily";
        String parameters = "SeqAptHo=" + SeqAptHo;
        parameters += "&DateFrom=" + DateFrom;
        parameters += "&DateTo=" + DateTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getUsageListMonthly(String SeqAptHo, String MonthFrom, String MonthTo) throws Exception {

        String targetUrl = apiUrl + "/GetUsageListMonthly";
        String parameters = "SeqAptHo=" + SeqAptHo;
        parameters += "&MonthFrom=" + MonthFrom;
        parameters += "&MonthTo=" + MonthTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getWorkerCount(String SeqCompany) throws Exception {

        String targetUrl = apiUrl + "/GetWorkerCount";
        String parameters = "SeqCompany=" + SeqCompany;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getWorkerListForPaging(String SeqCompany, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetWorkerListForPaging";
        String parameters = "SeqCompany=" + SeqCompany;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getWorkerIdCount(String WorkerId) throws Exception {

        String targetUrl = apiUrl + "/GetWorkerIdCount";
        String parameters = "WorkerId=" + WorkerId;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> createWorker(String SeqCompany, String WorkerId, String Password, String Name, String Phone, String Mail) {

        String targetUrl = apiUrl + "/CreateWorker";
        String parameters = "SeqCompany=" + SeqCompany;
        parameters += "&WorkerId=" + WorkerId;
        parameters += "&Password=" + Password;
        parameters += "&Name=" + Name;
        parameters += "&Phone=" + Phone;
        parameters += "&Mail=" + Mail;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getSiteList() throws Exception {

        String targetUrl = apiUrl + "/GetSiteList";

        return sendPost(targetUrl, "");
    }

    public static HashMap<String, Object> checkAdminLogin(String Id, String Password) throws Exception {

        String targetUrl = apiUrl + "/CheckAdminLogin";
        String parameters = "Id=" + Id;
        parameters += "&Password=" + Password;

        return sendPost(targetUrl, parameters);
    }

    /*hour*/
    public static HashMap<String, Object> getSiteMeteringResult(String SeqSite, String To) {

        String targetUrl = apiUrl + "/GetSiteMeteringResult";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&To=" + To;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getSiteMeteringResultWithDongHo(String SeqSite, String To, String dongName, String hoName) {

        String targetUrl = apiUrl + "/GetSiteMeteringResultWithDongHo";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&To=" + To;
        parameters += "&DongName=" + dongName;
        parameters += "&HoName=" + hoName;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetSiteMeteringState(String SeqSite, String Day) throws Exception {

        String targetUrl = apiUrl + "/GetSiteMeteringState";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&Day=" + Day;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetSiteListForReport(int Decor) throws Exception {

        String targetUrl = apiUrl + "/GetSiteListForReport";
        String parameters = "Decor=" + 1;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getAdminInfo(String SeqAdmin) throws Exception {

        String targetUrl = apiUrl + "/GetAdminInfo";
        String parameters = "SeqAdmin" + "=" + SeqAdmin;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> sendPost(String targetUrl, String parameters) {
        HashMap<String, Object> returnMap = null;

        try {
            URL url = new URL(targetUrl);
            HttpsURLConnection con = (HttpsURLConnection) url.openConnection();

            con.setRequestMethod("POST");
            con.setRequestProperty("content-type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Accept-Charset", "UTF-8");
            con.setDoOutput(true);

            try (OutputStream os = con.getOutputStream()) {
                os.write(parameters.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            int responseCode = con.getResponseCode();

            if (responseCode == 200) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8))) {
                    StringBuilder response = new StringBuilder();
                    String inputLine;

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }

                    ObjectMapper mapper = new ObjectMapper();
                    returnMap = mapper.readValue(response.toString(), new TypeReference<HashMap<String, Object>>() {
                    });
                }
            } else {
                // Handle non-200 response codes if needed
                System.out.println("Non-200 response code: " + responseCode);
            }
        } catch (IOException e) {
            e.printStackTrace();
            // Handle the exception as needed
        }

        return returnMap;
    }

    public static HashMap<String, Object> callApi(String method, String targetUrl, String parameters) {
        HashMap<String, Object> returnMap = null;

        //url 및 parameter check
//        System.out.println("url : "+ targetUrl + "?"+ parameters);

        try {
            if (method.equals("GET")) {
                if (!parameters.equals("")) {
                    targetUrl = targetUrl + "?" + parameters;
                }
            } else if (method.equals("DEL")) {
                method = "DELETE";
            }
            URL url = new URL(targetUrl);

            HttpsURLConnection con = (HttpsURLConnection) url.openConnection();

            con.setRequestMethod(method);
            con.setRequestProperty("Accept-Charset", "UTF-8");

            if (!method.equals("GET") && !method.equals("get")) {
                con.setRequestProperty("content-type", "application/x-www-form-urlencoded");
                con.setDoOutput(true);
                try (OutputStream os = con.getOutputStream()) {
                    os.write(parameters.getBytes(StandardCharsets.UTF_8));
                    os.flush();
                }
            }


            int responseCode = con.getResponseCode();

            if (responseCode == 200) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8))) {
                    StringBuilder response = new StringBuilder();
                    String inputLine;

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }

                    ObjectMapper mapper = new ObjectMapper();
                    returnMap = mapper.readValue(response.toString(), new TypeReference<HashMap<String, Object>>() {

                    });
                }
            } else {
                // Handle non-200 response codes if needed
                System.out.println("Non-200 response code: " + responseCode);
            }
        } catch (IOException e) {
            e.printStackTrace();
            // Handle the exception as needed
        }

        return returnMap;
    }

    public static HashMap<String, Object> collectBadMeters() throws Exception {

        String targetUrl = apiUrl + "/CollectBadMeters";
        String parameters = "";

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getLpListByMid(String Mid) throws Exception {
        System.out.println(Mid);
        String targetUrl = apiUrl + "/GetLpListByMid";
        String parameters = "Mid=" + Mid + "&MaxCount=10000";

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getAppRequestCount(String SeqSite) throws Exception {

        String targetUrl = apiUrl + "/GetAppRequestCount";
        String parameters = "SeqSite=" + SeqSite;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getAppRequestListForPaging(String SeqSite, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/GetAppRequestListForPaging";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&IndexFrom=" + IndexFrom + "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> setAppRequestsAsAccepted(String accept) throws Exception {

        String targetUrl = apiUrl + "/SetAppRequestsAsAccepted";
        String parameters = "SeqHoList=" + accept;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> setAppRequestsAsRejected(String reject) throws Exception {

        String targetUrl = apiUrl + "/SetAppRequestsAsRejected";
        String parameters = "SeqHoList=" + reject;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> SetAppRequestComment(String seq_ho, String Comment) throws Exception {

        String targetUrl = apiUrl + "/SetAppRequestComment";
        String parameters = "SeqHo=" + seq_ho;
        parameters += "&Comment=" + Comment;
        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> CreateDCU(String seqSite, String countDcu) throws Exception {

        String targetUrl = apiUrl + "/CreateDcu";
        String parameters = "SeqSite=" + seqSite;
        parameters += "&CountDcu=" + countDcu;
        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetUsageListLp(String SeqAptHo, String DateTarget) throws Exception {

        String targetUrl = apiUrl + "/GetUsageListLp";
        String parameters = "SeqAptHo=" + SeqAptHo;
        parameters += "&DateTarget=" + DateTarget;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> SetKpxRequestsAsAccepted(String SeqFamilyList) throws Exception {

        String targetUrl = apiUrl + "/SetKpxRequestsAsAccepted";
        String parameters = "SeqFamilyList=" + SeqFamilyList;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> SetKpxRequestsAsRejected(String SeqFamilyList) throws Exception {

        String targetUrl = apiUrl + "/SetKpxRequestsAsRejected";
        String parameters = "SeqFamilyList=" + SeqFamilyList;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }


    public static HashMap<String, Object> SetKnDrRequestsAsAccepted(String SeqFamilyList) throws Exception {

        String targetUrl = apiUrl + "/SetKnDrRequestsAsAccepted";
        String parameters = "SeqFamilyList=" + SeqFamilyList;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetKnDrWonListAssigned(String SeqFamily) throws Exception {

        String targetUrl = apiUrl + "/GetKnDrWonListAssigned";
        String parameters = "SeqFamily=" + SeqFamily;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }

    public static HashMap<String, Object> GetKnDrWonListPaid(String SeqFamily) throws Exception {

        String targetUrl = apiUrl + "/GetKnDrWonListPaid";
        String parameters = "SeqFamily=" + SeqFamily;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }

    public static HashMap<String, Object> GetKpxWonListAssigned(String SeqFamily) throws Exception {

        String targetUrl = apiUrl + "/GetKpxWonListAssigned";
        String parameters = "SeqFamily=" + SeqFamily;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }

    public static HashMap<String, Object> GetKpxWonListPaid(String SeqFamily) throws Exception {

        String targetUrl = apiUrl + "/GetKpxWonListPaid";
        String parameters = "SeqFamily=" + SeqFamily;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }

    public static HashMap<String, Object> SetKnDrRequestsAsRejected(String SeqFamilyList) throws Exception {

        String targetUrl = apiUrl + "/SetKnDrRequestsAsRejected";
        String parameters = "SeqFamilyList=" + SeqFamilyList;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }

    public static HashMap<String, Object> GetFileListOfReception(String SeqReception) throws Exception {

        String targetUrl = apiUrl + "/GetFileListOfReception";
        String parameters = "SeqReception=" + SeqReception;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }

    public static HashMap<String, Object> DeleteFileFromReception(String SeqReceptionFile) throws Exception {

        String targetUrl = apiUrl + "/DeleteFileFromReception";
        String parameters = "SeqReceptionFile=" + SeqReceptionFile;
        System.out.println(targetUrl + parameters);
        return sendPost(targetUrl, parameters);

    }

    public static HashMap<String, Object> DeleteAppRequestOfHo(int SeqHo) throws Exception {

        String targetUrl = apiUrl + "/DeleteAppRequestOfHo";
        String parameters = "SeqHo=" + SeqHo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> DeleteMembersOfHo(int SeqHo) throws Exception {

        String targetUrl = apiUrl + "/DeleteMembersOfHo";
        String parameters = "SeqHo=" + SeqHo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> GetMembersOfHo(int SeqHo) throws Exception {

        String targetUrl = apiUrl + "/GetMembersOfHo";
        String parameters = "SeqHo=" + SeqHo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> MoveMembersFromHoToHo(int SeqHoFrom, int SeqHoTo) throws Exception {

        String targetUrl = apiUrl + "/MoveMembersFromHoToHo";
        String parameters = "SeqHoFrom=" + SeqHoFrom;
        parameters += "&SeqHoTo=" + SeqHoTo;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> YlGetAppUserListOfAllSiteForPaging(int Year, int IndexFrom, int IndexTo) {

        String targetUrl = apiUrl + "/YlGetAppUserListOfAllSiteForPaging";
        String parameters = "Year=" + Year;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> YlGetAppRequestListOfAllSiteForPaging(int Year, int IndexFrom, int IndexTo) throws Exception {

        String targetUrl = apiUrl + "/YlGetAppRequestListOfAllSiteForPaging";
        String parameters = "Year=" + Year;
        parameters += "&IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> AdminAuthInfo(String method) throws Exception {

        String targetUrl = apiUrl + "/AdminAuthInfo";
        String parameters = "";

        return callApi(method, targetUrl, parameters);
    }

    //    public static HashMap<String, Object> AdminAuthInfo(String method, String nSeqAdmin) throws Exception {
//
//        String targetUrl = apiUrl + "/AdminAuthInfo";
//        String parameters = "";
//        parameters += "nSeqAdmin=" + nSeqAdmin;
//
//        return callApi(method, targetUrl, parameters);
//    }
    public static HashMap<String, Object> AdminAuthInfo(String method, HashMap<String, Object> paramMap) {

        String targetUrl = apiUrl + "/AdminAuthInfo";
        String parameters = "";
        if (paramMap.get("nSeqAdmin") != null) {
            parameters += "&nSeqAdmin=" + paramMap.get("nSeqAdmin");
        }
        if (paramMap.get("nSeqLevelCode") != null) {
            parameters += "&nSeqLevelCode=" + paramMap.get("nSeqLevelCode");
        }
        if (paramMap.get("Name") != null) {
            parameters += "&Name=" + paramMap.get("Name");
        }
        if (paramMap.get("Password") != null) {
            parameters += "&Password=" + paramMap.get("Password");
        }
        if (paramMap.get("empName") != null) {
            parameters += "&empName=" + paramMap.get("empName");
        }
        if (paramMap.get("nSeqCompany") != null) {
            parameters += "&nSeqCompany=" + paramMap.get("nSeqCompany");
        }
        if (paramMap.get("Phone") != null) {
            parameters += "&Phone=" + paramMap.get("Phone");
        }
        if (paramMap.get("Id") != null) {
            parameters += "&Id=" + paramMap.get("Id");
        }


        if (parameters.length() != 0 && parameters.charAt(0) == '&') {
            parameters = parameters.substring(1);
        }

        return callApi(method, targetUrl, parameters);
    }


    public static HashMap<String, Object> AdminAuthMenu(String method) throws Exception {

        String targetUrl = apiUrl + "/AdminAuthMenu";
        String parameters = "";

        return callApi(method, targetUrl, parameters);
    }

    public static HashMap<String, Object> AdminAuth(String method, String nSeqAdmin, String nSeqLevelCode, String nSeqMenu, String crudData) throws Exception {

        String targetUrl = apiUrl + "/AdminAuth";
        String parameters = "";
        parameters += "nSeqAdmin=" + nSeqAdmin;
        parameters += "&nSeqLevelCode=" + nSeqLevelCode;
        parameters += "&nSeqMenu=" + nSeqMenu;
        parameters += "&crudData=" + crudData;

        return callApi(method, targetUrl, parameters);
    }

    public static HashMap<String, Object> AdminAuthLevel(String method, String nSeqAdmin) throws Exception {

        String targetUrl = apiUrl + "/AdminAuthLevel";
        String parameters = "";
        parameters += "nSeqAdmin=" + nSeqAdmin;

        return callApi(method, targetUrl, parameters);
    }

    public static HashMap<String, Object> AdminAuthLevel(String method, HashMap<String, Object> paramMap) throws Exception {

        String targetUrl = apiUrl + "/AdminAuthLevel";
        String parameters = "";


        if (paramMap.get("nSeqLevelCode") != null) {
            parameters += "&nSeqLevelCode=" + paramMap.get("nSeqLevelCode");
        }
        if (paramMap.get("levelCode") != null) {
            parameters += "&Name=" + paramMap.get("levelCode");
        }
        if (paramMap.get("levelName") != null) {
            parameters += "&Password=" + paramMap.get("levelName");
        }

        if (parameters.length() != 0 && parameters.charAt(0) == '&') {
            parameters = parameters.substring(1);
        }

        return callApi(method, targetUrl, parameters);
    }

    public static HashMap<String, Object> AdminAuthInfoCheck(String method, HashMap<String, Object> paramMap) throws Exception {

        String targetUrl = apiUrl + "/AdminAuthInfoCheck";
        String parameters = "";

        parameters += "Id=" + paramMap.get("Id");

        return callApi(method, targetUrl, parameters);
    }

    public static HashMap<String, Object> AdminAction(String method, HashMap<String, Object> paramMap) throws Exception {

        String targetUrl = apiUrl + "/AdminAction";
        String parameters = "";

        parameters += "nSeqAdmin=" + paramMap.get("nSeqAdmin");
        parameters += "nSeqMenu=" + paramMap.get("nSeqMenu");
        parameters += "menuName=" + paramMap.get("menuName");
        parameters += "menuPath=" + paramMap.get("menuPath");
        parameters += "actionName=" + paramMap.get("actionName");
        parameters += "ip=" + paramMap.get("ip");

        return callApi(method, targetUrl, parameters);

    }

    /*day*/
    public static HashMap<String, Object> GetSiteMeteringResultByDayWithDongHo(String SeqSite, String To, String dongName, String hoName, String seqCode) {
        hoName = hoName == null ? "" : hoName;
        dongName = dongName == null ? "" : dongName;

        String targetUrl = apiUrl + "/GetSiteMeteringResultByDayWithDongHo";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&To=" + To;
        parameters += "&DongName=" + dongName;
        parameters += "&HoName=" + hoName;
        parameters += "&seqCode=" + seqCode;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> GetSiteMeteringResultByDay(String SeqSite, String To, String seqCode, String seqCodeLpType) {

        String targetUrl = apiUrl + "/GetSiteMeteringResultByDay";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&To=" + To;
        parameters += "&seqCode=" + seqCode;
        parameters += "&seqCodeLpType=" + seqCodeLpType;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getSiteMeteringStateV2(String SeqSite, String Day) {

        String targetUrl = apiUrl + "/GetSiteMeteringStateV2";
        String parameters = "SeqSite=" + SeqSite;
        parameters += "&Day=" + Day;

        return sendPost(targetUrl, parameters);
    }


    public static HashMap<String, Object> getKnDrListForPaging(int IndexFrom, int IndexTo) {

        String targetUrl = apiUrl + "/GetKnDrListForPaging";
        String parameters = "IndexFrom=" + IndexFrom;
        parameters += "&IndexTo=" + IndexTo;

        return sendPost(targetUrl, parameters);
    }

    public static HashMap<String, Object> getKnDrSentMemberList(String SeqKnDr) {

        String targetUrl = apiUrl + "/GetKnDrSentMemberList";
        String parameters = "SeqKnDr=" + SeqKnDr;

        return sendPost(targetUrl, parameters);
    }

}