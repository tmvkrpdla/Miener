/**
 * 2020.04.17
 * v 2.1.1
 */
var enernet = enernet || {};
enernet.namespace = function (ns_string) {
    var parts = ns_string.split('.'), parent = enernet, i;
    if (parts[0] === "enernet") {
        parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}

enernet.namespace('enernet.modules.api');
//api === ENERNET.modules.api; // true


enernet.modules.api = function () {
    //   ======================================================================   //
    //   private
    //   api url 기본 주소
    var _apiUrl = "https://smartami.kr:18513";
    var _workApiUrl = "https://www.egservice.co.kr:18613";

    //   api 요청시 사용 되는 함수
    //   async false 동기   url, data, func, '', '', 'false'      ==>   ''이것은 false로 간주하기때문에 조심히 사용할것
    //   async true 비동기   url, data, func


    var _apiCallPost = function (url, data, successCallBack, errorCallBack, async) {

        if (async == undefined || async == '') {
            async = true;
        } else {
            if (async == 'false') {
                async = false;
            } else {
                async = true;
            }
        }

        // adminEventMapping(url);// 이벤트 로그 맵핑 / 로그 함수

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            async: async,
            success: function (data) {
                // console.log("success : " + url);
                // console.log(data);
                if (successCallBack == undefined || successCallBack == '') {
                    console.log('success callback undefined');
                } else {
                    successCallBack(data);
                }

            },
            error: function (e) {
                $('.wrap-loading').addClass('display-none');
                if (errorCallBack == undefined || errCallBack == '') {
                    //console.log("error");
                    //console.log(data);
                    var _obj = {}
                    _obj.data = data;
                    _obj.status = e.status;
                    _obj.statusText = e.statusText;
                    _obj.requestUrl = url;

                    _ajaxCall("../ajax/error", _obj);

                } else {
                    errorCallBack(e);
                }
            }
        });
    };

    //   api call   async
    function _apiCallAsyncLoading(_url, _data) {
        var _returnData = null;

        $.ajax({
            url: _url,
            type: 'POST',
            dataType: 'json',
            data: _data,
            async: false,
            beforeSend: function () {
                $('div.wrap-loading').removeClass('display-none');
            },
            success: function (response) {
                _returnData = response;
            },
            complete: function () {
                $('.wrap-loading').addClass('display-none');
            },
            error: function (e) {
                $('.wrap-loading').addClass('display-none');

                var _obj = {}
                _obj.data = _data;
                _obj.status = e.status;
                _obj.statusText = e.statusText;
                _obj.requestUrl = _url;

                _ajaxCall("../ajax/error", _obj);
            }
        });

        return _returnData;
    }

    function _apiCallAsync(_url, _data) {
        var _returnData = null;

        $.ajax({
            url: _url,
            type: 'POST',
            dataType: 'json',
            data: _data,
            async: false,
            beforeSend: function () {
                $('div.wrap-loading').removeClass('display-none');
            },
            success: function (response) {
                _returnData = response;
            },
            complete: function () {
                $('.wrap-loading').addClass('display-none');
            },
            error: function (e) {
                $('.wrap-loading').addClass('display-none');

                var _obj = {}
                _obj.data = _data;
                _obj.status = e.status;
                _obj.statusText = e.statusText;
                _obj.requestUrl = _url;

                _ajaxCall("../ajax/error", _obj);
            }
        });

        return _returnData;
    }

    //   private   error 로그 처리
    function _ajaxCall(_url, _data) {

        $.ajax({

            url: _url,
            contentType: 'application/json;charset=utf-8;',
            type: 'POST',
            data: JSON.stringify(_data),
            success: function (data) {
            },
            error: function (e) {
                //console.log(e)
                //alert('서버와 실패하였습니다');
            }
        });
    }


    //   ======================================================================   //


    //   ======================================================================   //

    //   form 전송      url 과 formname 값 필요
    function _ajaxFormPostAsync(requestUrl, formName) {
        var _returnData = null;

        var _form = $("form[name=" + formName + "]")[0];

        var _formData = new FormData(_form)

        $.ajax({
            url: requestUrl,
            type: 'post',
            processData: false,
            contentType: false,
            data: _formData,
            async: false,
            beforeSend: function () {
                $('div.wrap-loading').removeClass('display-none');
            },
            success: function (response) {
                //console.log(2)
                _returnData = response;
            },
            complete: function () {
                $('.wrap-loading').addClass('display-none');
            },
            error: function (e) {
                //console.log(_form)
                alert('서버 전송에 실패하였습니다');
                var _obj = {}
                _obj.status = e.status;
                _obj.statusText = e.statusText;
                _obj.requestUrl = requestUrl;
                _obj.data = {};

                var _formNameData = {};

                var _inputNameArr = $(_form).find('input[name]');
                for (var i = 0; i < _inputNameArr.length; i++) {
                    var _inputName = _inputNameArr[i].name;

                    if ($("#" + _inputName).length == 0) {
                        continue;
                    } else {
                        var _inputData = $("#" + _inputName).val();
                        _formNameData[_inputName] = _inputData;
                    }
                }

                _obj.data = _formNameData;

                _ajaxCall("../ajax/error", _obj);
            }
        });

        return _returnData;
    }

    //   ======================================================================   //


    //   아파트 정보 불러오기
    var _getDongHoListForPaging = function (SeqSite, IndexFrom, IndexTo) {
        var _returnData = null;
        var _url = _apiUrl + "/api/GetDongHoListForPaging";

        var _data = {};
        _data.SeqSite = SeqSite;
        _data.IndexFrom = IndexFrom;
        _data.IndexTo = IndexTo;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    var _getSiteListByMdms = function (SeqMdms) {
        var _returnData = null;
        var _url = _apiUrl + "/api/GetSiteListByMdms";

        var _data = {};
        _data.SeqMdms = SeqMdms;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    var _getDongListBySite = function (SeqSite) {
        var _returnData = null;
        var _url = _apiUrl + "/api/GetDongListBySite";

        var _data = {};
        _data.SeqSite = SeqSite;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    var _getDcuListBySite = function (SeqSite) {
        var _returnData = null;
        var _url = _apiUrl + "/api/GetDcuListBySite";

        var _data = {};
        _data.SeqSite = SeqSite;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    //작업자 id 중복확인
    var _getWorkerIdCount = function (WorkerId) {
        var _returnData = null;
        var _url = _apiUrl + "/api/GetWorkerIdCount";

        var _data = {};
        _data.WorkerId = WorkerId;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    // 작업자 등록
    var _createWorker = function (SeqCompany, WorkerId, Password, Name, Phone, Mail) {
        var _returnData = null;
        var _url = _apiUrl + "/api/CreateWorker";

        var _data = {};
        _data.SeqCompany = SeqCompany;
        _data.WorkerId = WorkerId;
        _data.Password = Password;
        _data.Name = Name;
        _data.Phone = Phone;
        _data.Mail = Mail;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    //
    var _getAmiInfo = function () {
        var _returnData = null;
        var _url = _apiUrl + "/api/GetAmiInfo";

        var _data = {};

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    // 단지등록
    var _createSite = function (SiteName, SiteCode, SitePhone) {
        var _returnData = null;
        var _url = _apiUrl + "/api/CreateSite";

        var _data = {};
        _data.SiteName = SiteName;
        _data.SiteCode = SiteCode;
        _data.SitePhone = SitePhone;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    // 단지등록2
    var _createSiteFull = function (Name, Code, Phone, Address, AddressJibun,
                                    ZipCode, RoadCode, AreaCode, dx, dy, ReadDay, YearBuilt,
                                    MonthBuilt, DayBuilt, Fax, Email, Area1, Area2, ParkingTop,
                                    ParkingGround, ParkingUnder, Elev, PassageType, State, Comment) {

        var _returnData = null;
        var _url = _apiUrl + "/api/CreateSiteFull";

        var _data = {};
        _data.Name = Name;
        _data.Code = Code;
        _data.Phone = Phone;
        _data.Address = Address;
        _data.AddressJibun = AddressJibun;
        _data.ZipCode = ZipCode;
        _data.RoadCode = RoadCode;
        _data.AreaCode = AreaCode;
        _data.dx = dx;
        _data.dy = dy;
        _data.ReadDay = ReadDay;
        _data.YearBuilt = YearBuilt;
        _data.MonthBuilt = MonthBuilt;
        _data.DayBuilt = DayBuilt;
        _data.Fax = Fax;
        _data.Email = Email;
        _data.Area1 = Area1;
        _data.Area2 = Area2;
        _data.ParkingTop = ParkingTop;
        _data.ParkingGround = ParkingGround;
        _data.ParkingUnder = ParkingUnder;
        _data.Elev = Elev;
        _data.PassageType = PassageType;
        _data.State = State;
        _data.Comment = Comment;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    // 동 저장
    var _addDong = function (SeqSite, DongName, HoNameList) {


        var _returnData = null;
        var _url = _apiUrl + "/api/AddDong";

        var _data = {};
        _data.SeqSite = SeqSite;
        _data.DongName = DongName;
        _data.HoNameList = HoNameList;


        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    // 계량기 등록
    var _installMeter = function (SeqHo, SeqWorker, Mid, ValueStart, MidPrev, ValueLastPrev, BoundToModem) {
        var _returnData = null;
        var _url = _workApiUrl + "/api/InstallMeter";

        var _data = {};
        _data.SeqHo = SeqHo;
        _data.SeqWorker = SeqWorker;
        _data.Mid = Mid;
        _data.ValueStart = ValueStart;
        _data.MidPrev = MidPrev;
        _data.ValueLastPrev = ValueLastPrev;
        _data.BoundToModem = BoundToModem;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');


        return _returnData;
    }

    //계량기 등록 삭제
    var _uninstallMeter = function (SeqWorker, SeqHo) {
        var _returnData = null;
        var _url = _workApiUrl + "/api/UninstallMeter";

        var _data = {};
        _data.SeqWorker = SeqWorker;
        _data.SeqHo = SeqHo;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }
    //계량기 이미지 삭제
    var _deleteImageMeter = function (SeqWorker, SeqImageMeter) {
        var _returnData = null;
        var _url = _workApiUrl + "/api/DeleteImageMeter";

        var _data = {};
        _data.SeqWorker = SeqWorker;
        _data.SeqImageMeter = SeqImageMeter;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    //dcu 이미지 삭제
    var _deleteImageDcu = function (SeqImageDcu) {
        console.log("SeqImageDcu : ", SeqImageDcu);
        var _returnData = null;
        var _url = _workApiUrl + "/api/DeleteImageDcu";

        // 쿼리 스트링 생성
        var queryString = "?SeqImageDcu=" + encodeURIComponent(SeqImageDcu);
        // SeqWorker도 필요하면 아래처럼 추가
        // queryString += "&SeqWorker=" + encodeURIComponent(SeqWorker);

        // GET/POST 모두 쿼리스트링은 URL에 붙일 수 있음
        _apiCallPost(_url + queryString, {}, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    //   아파트 호 목록 불러오기
    var _getHoListByDong = function (SeqDong) {
        var _returnData = null;
        var _url = _apiUrl + "/api/GetHoListByDong";

        var _data = {};
        _data.SeqDong = SeqDong;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }


    //   앱 승인
    var _setAppRequestsAsAccepted = function (SeqHoList) {
        var _returnData = null;
        var _url = _apiUrl + "/api/SetAppRequestsAsAccepted";

        var _data = {};
        _data.SeqHoList = SeqHoList;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    //   앱 거절
    var _setAppRequestsAsRejected = function (SeqHoList) {
        var _returnData = null;
        var _url = _apiUrl + "/api/SetAppRequestsAsRejected";

        var _data = {};
        _data.SeqHoList = SeqHoList;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    //   앱 요청 코멘트
    var _setAppRequestComment = function (SeqHo, Comment) {
        var _returnData = null;
        var _url = _apiUrl + "/api/SetAppRequestComment";

        var _data = {};
        _data.SeqHo = SeqHo;
        _data.Comment = Comment;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    // Dr 생성
    var _createKnDr = function (SeqSiteList, TimeBegin, TimeEnd) {
        var _returnData = null;
        var _url = _apiUrl + "/api/CreateKnDr";

        var _data = {};
        _data.SeqSiteList = SeqSiteList;
        _data.TimeBegin = TimeBegin;
        _data.TimeEnd = TimeEnd;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    var _doDrPay = function (SeqFamily, WonPay) {
        var _returnData = null;
        var _url = _apiUrl + "/api/DoDrPay";

        var _data = {};
        _data.SeqFamily = SeqFamily;
        _data.WonPay = WonPay;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    var _doKpxDrPay = function (SeqFamily, WonPay) {
        var _returnData = null;
        var _url = _apiUrl + "/api/DoKpxPay";

        var _data = {};
        _data.SeqFamily = SeqFamily;
        _data.WonPay = WonPay;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    // 호 삭제
    var _deleteHo = function (SeqHo) {
        var _returnData = null;
        var _url = _apiUrl + "/api/DeleteHo";

        var _data = {};
        _data.SeqHo = SeqHo;

        _apiCallPost(_url, _data, function (data) {
            _returnData = data;
        }, undefined, 'false');

        return _returnData;
    }

    return {
        getDongHoListForPaging: _getDongHoListForPaging,
        getSiteListByMdms: _getSiteListByMdms,
        getDongListBySite: _getDongListBySite,
        getDcuListBySite: _getDcuListBySite,
        createWorker: _createWorker, // 사용하지 않음
        getWorkerIdCount: _getWorkerIdCount, // 사용하지 않음
        getAmiInfo: _getAmiInfo, // 사용하지 않음
        createSite: _createSite,
        addDong: _addDong,
        installMeter: _installMeter,
        uninstallMeter: _uninstallMeter,
        deleteImageMeter: _deleteImageMeter,
        deleteImageDcu: _deleteImageDcu,
        getHoListByDong: _getHoListByDong,
        createSiteFull: _createSiteFull,
        setAppRequestsAsAccepted: _setAppRequestsAsAccepted,
        setAppRequestsAsRejected: _setAppRequestsAsRejected,
        setAppRequestComment: _setAppRequestComment,
        createKnDr: _createKnDr,
        doDrPay: _doDrPay,
        deleteHo: _deleteHo,
        doKpxDrPay: _doKpxDrPay
    };
}();
