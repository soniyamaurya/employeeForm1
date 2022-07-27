/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMP-DB";
var empRelationName = "EmpData";
var connToken = "90938515|-31948828544043325|90947100";

function saveRecNo2lS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empid = $('#empid').val();
    var jsonStr = {
        id: empid
    };
    return JSON.stringify(jsonStr);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "")
    {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    // alert(putRequest);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML)
    console.log(resJsonObj);
    //  alert(JSON.stringify(resJsonObj));
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#empid').focus();
}

function changeData() {
    $('#change').prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    // alert(updateRequest);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#empid').focus();
}

function resetForm() {
    $('#empid').val("");
    $('#empname').val("");
    $('#empsal').val("");
    $('#hra').val("");
    $('#da').val("");
    $('#deduct').val("");
    $('#empid').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#empid').focus();
}

function validateData() {
    var empid, empname, empsal, hra, da, deduct;
    empid = $('#empid').val();
    empname = $('#empname').val();
    empsal = $('#empsal').val();
    hra = $('#hra').val();
    da = $('#da').val();
    deduct = $('#deduct').val();

    if (empid === "") {
        alert("Employee ID Missing");
        $('#empid').focus();
        return "";
    }
    if (empname === "") {
        alert("Employee Name Missing");
        $('#empid').focus();
        return "";
    }
    if (empsal === "") {
        alert("Employee Salary Missing");
        $('#empid').focus();
        return "";
    }
    if (hra === "") {
        alert("Employee HRA Missing");
        $('#empid').focus();
        return "";
    }
    if (da === "") {
        alert("Employee DA Missing");
        $('#empid').focus();
        return "";
    }
    if (deduct === "") {
        alert("Employee Deduct Missing");
        $('#empid').focus();
        return "";
    }
    var jsonStrObj = {
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    };
    return JSON.stringify(jsonStrObj);
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    // alert(empIdJsonObj);
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#empname').focus();
    } else if (resJsonObj.status === 200) {
        $('#empid').prop("disabled", true);
        fillData(resJsonObj);
        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#empname').focus();
    }
}

function fillData(jsonObj) {
    saveRecNo2lS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#empname').val(data.name);
    $('#empsal').val(data.salary);
    $('#hra').val(data.hra);
    $('#da').val(data.da);
    $('#deduct').val(data.deduction);
}