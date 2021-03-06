$(window).on('resize', function() {
    resizeModals();
});

function assignIssue(event) {
    if (event)
        event.preventDefault();

    var issueId = $('#issue_id').val();
    var projectId = $('#project_id').val();
    var userAssignedId = $('#issue_ua_id').val();

    var options = {
        dialogClass: "ubirimi-dialog",
        title: 'Assign Issue',
        buttons: [
            {
                text: "Assign",
                click: function () {

                    if (userAssignedId == $('#render_assign_issue_field_type_assignee').val()) {
                        $('#issue_new_ua_id_error').html('The issue is already assigned to this user.');
                        return
                    }
                    $.ajax({
                        type: "POST",
                        url: '/yongo/issue/assign',
                        data: {
                            issue_id: issueId,
                            user_assigned_id: $('#render_assign_issue_field_type_assignee').val(),
                            comment: $('#render_assign_issue_field_type_comment').val()
                        },
                        success: function (response) {
                            $("#modalEditIssueAssign").dialog('destroy');
                            $("#modalEditIssueAssign").empty();
                            location.reload();
                        }
                    });
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ],
        close: function () {
            $("#modalEditIssueAssign").dialog('destroy');
            $("#modalEditIssueAssign").empty();

        }
    };

    $("#modalEditIssueAssign").load("/yongo/issue/assign-dialog/" + issueId + '/' + projectId, [], function () {
        $("#modalEditIssueAssign").dialog(options);
        $("#modalEditIssueAssign").dialog("open");
        $(".ui-dialog-content .select2InputMedium").select2();
        $(".ui-dialog-content .select2InputMedium").select2("open");
    });
}

function createSubtask(issueId, projectId, onSuccess) {

    var options = {

        title: 'Create Sub-Task',
        buttons: [
            {
                text: "Create Sub-Task",
                click: function () {

                    // deal with mandatory flags
                    var responseMandatoryFields = dealWithMandatoryFieldsInModals();
                    if (responseMandatoryFields && responseMandatoryFields[1]) {
                        $('#errorsMandatoryFieldsNotPresentOnScreen').html(responseMandatoryFields[1]);
                        return
                    }

                    var fields = $("[id^='field_type_']");
                    var fieldsCustom = $("[id^='field_custom_type_']");

                    var attachments = $("[id^='attach_']");
                    var field_types = [];
                    var field_types_custom = [];
                    var field_values = [];
                    var field_values_custom = [];

                    // deal with the regular fields
                    var i, elemId;

                    for (i = 0; i < fields.length; i++) {
                        elemId = fields[i].getAttribute('id');
                        field_types.push(elemId.replace('field_type_', ''));
                        field_values.push($('#' + elemId).val());
                    }

                    // deal with the custom fields
                    for (i = 0; i < fieldsCustom.length; i++) {
                        elemId = fieldsCustom[i].getAttribute('id');
                        field_types_custom.push(elemId.replace('field_custom_type_', ''));
                        field_values_custom.push($('#' + elemId).val());
                    }

                    var attach_ids = [];
                    for (i = 0; i < attachments.length; i++) {
                        var check_id = attachments[i].getAttribute('id');
                        var checked = ($('#' + check_id).is(':checked'));
                        if (checked)
                            attach_ids.push(attachments[i].getAttribute('id').replace('attach_', ''));
                    }

                    if (!attach_ids.length) {
                        attach_ids = null;
                    }
                    $.ajax({
                        type: "POST",
                        url: '/yongo/issue/save',
                        data: {
                            issue_id: issueId,
                            project_id: projectId,
                            field_types: field_types,
                            field_values: field_values,
                            field_types_custom: field_types_custom,
                            field_values_custom: field_values_custom,

                            attach_ids: attach_ids
                        },
                        success: function (response) {
                            $("#modalAddSubTask").dialog('destroy');
                            $("#modalAddSubTask").empty();

                            if (onSuccess)
                                onSuccess();
                        }
                    });

                }
            },
            {
                text: "Cancel",
                click: function () {
                    $.ajax({
                        type: "POST",
                        url: '/yongo/issue/cleanup',
                        data: {
                            issue_id: issueId
                        },
                        success: function (response) {
                            $("#modalAddSubTask").dialog('destroy');
                            $("#modalAddSubTask").empty();
                        }
                    });
                }
            }
        ],
        close: function () {
            var modalAddSubTask = $("#modalAddSubTask");
            modalAddSubTask.dialog('destroy');
            modalAddSubTask.empty();
            $(".ui-dialog-content .select2Input").select2();
        }
    };

    $("#modalAddSubTask").load("/yongo/issue/add-subtask-dialog/" + issueId + '/' + projectId, [], function () {
        $("#modalAddSubTask").dialog(options);
        $("#modalAddSubTask").dialog("open");

        // call initialization file
        if (window.File && window.FileList && window.FileReader) {
            $(".ui-dialog-content .select2Input").select2();
            if ($("#field_type_component").children().length) {
                $("#field_type_component").select2();
                $("#field_type_component").change(function() {
                    $("[id^='s2_id_field_type_component'] > ul > li > div").each(function (i, selected) {
                        $(this).text($(this).text().replace(/^\s+/,""));
                    });
                });
            }
            var due_date_picker = $("#field_type_due_date");
            if (due_date_picker.length) {
                due_date_picker.datepicker({dateFormat: "yy-mm-dd"});
            }

            initializaFileUpload();

            $('#modalAddSubTask').find('input').eq(0).focus();
        }
    });
}

function dealWithMandatoryFieldsInModals() {
    var fields = $("[id^='field_type_'], [id^='field_custom_type_']");
    fields.push($());

    var mandatoryFieldEmpty = false;
    var messages = [];
    $('.requiredModalField').remove();
    for (var i = 0; i < fields.length; i++) {
        if (fields[i] instanceof HTMLElement) {
            var requiredFlag = fields[i].getAttribute('required');

            if (parseInt(requiredFlag)) {

                var valueOfField = $('#' + fields[i].getAttribute('id')).val();

                var fieldDescription = $('#' + fields[i].getAttribute('id')).attr('description');

                if (!valueOfField) {

                    mandatoryFieldEmpty = true;
                    if (fieldDescription) {
                        messages.push('<div class="requiredModalField">You must specify the ' + fieldDescription + ' of this issue.</div>');
                    } else {
                        $('#' + fields[i].getAttribute('id')).parent().append('<div class="requiredModalField">This field is mandatory</div>');
                    }
                }
            }
        }
    }
    if (mandatoryFieldEmpty)
        return [true, messages];
    else
        return null
}

function editIssue(issueId) {

    var options = {
        dialogClass: "ubirimi-dialog",
        title: 'Edit Issue',
        buttons: [
            {
                text: "Edit Issue",
                'class': 'btn ubirimi-btn',
                click: function () {

                    var responseMandatoryFields = dealWithMandatoryFieldsInModals();

                    if (responseMandatoryFields && responseMandatoryFields[1]) {
                        $('#errorsMandatoryFieldsNotPresentOnScreen').html(responseMandatoryFields[1]);
                        return
                    }

                    var fields = $("[id^='field_type_']");
                    var fieldsCustom = $("[id^='field_custom_type_']");
                    var attachments = $("[id^='attach_']");
                    var field_types = [];
                    var field_types_custom = [];
                    var field_values = [];
                    var field_values_custom = [];
                    var i, elemId;

                    // deal with the regular fields
                    for (i = 0; i < fields.length; i++) {
                        elemId = fields[i].getAttribute('id');
                        field_types.push(elemId.replace('field_type_', ''));
                        field_values.push($('#' + elemId).val());
                    }

                    // deal with the custom fields
                    for (i = 0; i < fieldsCustom.length; i++) {
                        elemId = fieldsCustom[i].getAttribute('id');
                        field_types_custom.push(elemId.replace('field_custom_type_', ''));
                        field_values_custom.push($('#' + elemId).val());
                    }

                    var attach_ids = [];
                    for (i = 0; i < attachments.length; i++) {
                        var check_id = attachments[i].getAttribute('id');
                        var checked = ($('#' + check_id).is(':checked'));
                        if (checked) {
                            attach_ids.push(attachments[i].getAttribute('id').replace('attach_', ''));
                        }
                    }

                    if (!attach_ids.length) {
                        attach_ids = null;
                    }

                    $.ajax({
                        type: "POST",
                        url: '/yongo/issue/update',
                        data: {
                            issue_id: issueId,
                            field_types: field_types,
                            field_values: field_values,
                            field_types_custom: field_types_custom,
                            field_values_custom: field_values_custom,
                            attach_ids: attach_ids
                        },
                        success: function (response) {
                            $("#modalEditIssue").dialog('destroy');
                            $("#modalEditIssue").empty();
                            location.reload();
                        }
                    });
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $.ajax({
                        type: "POST",
                        url: '/yongo/issue/cleanup',
                        data: {
                            issue_id: issueId
                        },
                        success: function (response) {
                            $("#modalEditIssue").dialog('destroy');
                            $("#modalEditIssue").empty();
                        }
                    });
                }
            }
        ],
        close: function () {
            $("#modalEditIssue").dialog('destroy');
            $("#modalEditIssue").empty();
        }
    };

    $("#modalEditIssue").load("/yongo/issue/update-dialog/" + issueId, [], function () {
        $("#modalEditIssue").dialog(options);
        $("#modalEditIssue").dialog("open");

        $(".ui-dialog-content .select2Input").select2();
        $(".ui-dialog-content .select2InputMedium").select2();
        $(".ui-dialog-content .select2InputLarge").select2();

        $("[id^='s2id_field_type_component'] > ul > li > div").each(function (i, selected) {
            $(this).text($(this).text().replace(/^\s+/,""));
        });

        $("#field_type_component").select2();
        $("#field_type_component").change(function() {
            $("[id^='s2id_field_type_component'] > ul > li > div").each(function (i, selected) {
                $(this).text($(this).text().replace(/^\s+/,""));
            });
        });

        var inputFocusedValue = $('#modalEditIssue').find('input').eq(0).val();
        $('#modalEditIssue').find('input').eq(0).focus().val(inputFocusedValue);

        var due_date_picker = $("#field_type_due_date");
        if (due_date_picker.length) {
            due_date_picker.datepicker({dateFormat: "yy-mm-dd"});
        }

        var customFieldsDatePickers = $("[id^='field_custom_type_']");

        for (var i = 0; i < customFieldsDatePickers.length; i++) {
            var elemId = customFieldsDatePickers[i].getAttribute('id');
            if (elemId.indexOf('date_picker') != -1)
                $('#' + elemId).datepicker({dateFormat: "yy-mm-dd"});
            if (elemId.indexOf('date_time') != -1)
                $('#' + elemId).datetimepicker({
                    timeFormat: "hh:mm",
                    dateFormat: "yy-mm-dd",
                    ampm: false
                });
        }

        // call initialization file
        if (window.File && window.FileList && window.FileReader) {
            initializaFileUpload(issueId);
        }

        resizeModals();
    });
}

function createIssue(message) {

    function initializeDialog(message) {

        var canCreateIssue = parseInt($('#can_create_issue_in_projects').val());
        if (!canCreateIssue) {
            options.buttons.shift();
            options.buttons.shift();
        }

        $("#modalCreateIssue").load("/yongo/render-create-issue/" + canCreateIssue, [], function () {
            $("#modalCreateIssue").dialog(options);
            $("#modalCreateIssue").dialog("open");

            applyStylesDialog();

            $(".ui-dialog-content .select2Input").select2();
            $(".ui-dialog-content .select2InputMedium").select2();

            if ($("#field_type_component").children().length) {
                $("#field_type_component").select2();

                $("#field_type_component").change(function() {

                    $("[id^='s2id_field_type_component'] > ul > li > div").each(function (i, selected) {
                        $(this).text($(this).text().replace(/^\s+/,""));
                    });
                });
            }

            var due_date_picker = $("#field_type_due_date");
            if (due_date_picker.length) {
                due_date_picker.datepicker({dateFormat: "yy-mm-dd"});
            }

            var customFieldsDatePickers = $("[id^='field_custom_type_']");

            for (var i = 0; i < customFieldsDatePickers.length; i++) {
                var elemId = customFieldsDatePickers[i].getAttribute('id');
                if (elemId.indexOf('date_picker') != -1)
                    $('#' + elemId).datepicker({dateFormat: "yy-mm-dd"});
                if (elemId.indexOf('date_time') != -1) {
                    $('#' + elemId).datetimepicker({
                        timeFormat: "hh:mm",
                        dateFormat: "yy-mm-dd",
                        ampm: false
                    });
                }
            }

            if (message) {
                $('#messageIssueCreatedDialog').html(message);
                $('#messageIssueCreatedDialog').show();
            }

            $('#modalCreateIssue').find('input').eq(4).focus();

            // call initialization file
            if (window.File && window.FileList && window.FileReader) {
                initializaFileUpload();
            }

            resizeModals();
        });
    }

    $('#contentMenuIssues').hide();
    $('#contentMenuHome').hide();
    $('#contentMenuProjects').hide();
    $('#menuIssueSearchViewOptionsContent').hide();

    var menuSelected = $('#menu_selected').val();
    if (menuSelected == 'home') {
        $('#menuHome').css('background-color', '#eeeeee');
    } else
        $('#menuHome').css('background-color', '#6A8EB2');

    if (menuSelected == 'project') {
        $('#menuProjects').css('background-color', '#eeeeee');
    } else
        $('#menuProjects').css('background-color', '#6A8EB2');

    if (menuSelected == 'issue') {
        $('#menuIssues').css('background-color', '#eeeeee');
    } else
        $('#menuIssues').css('background-color', '#6A8EB2');

    var options = {
        title: 'Create Issue',
        dialogClass: "ubirimi-dialog",
        buttons: [
            {
                text: "Create Issue",
                click: function (event) {
                    if ($(event.target).hasClass('disabled')) {
                        return;
                    }
                    createIssueProcess();
                }
            },
            {
                text: "Create & Another One",
                click: function (event) {
                    if ($(event.target).hasClass('disabled')) {
                        return;
                    }

                    createIssueProcess(true);
                }
            },
            {
                text: "Cancel",
                click: function () {
                    var canCreateIssue = parseInt($('#can_create_issue_in_projects').val());
                    if (canCreateIssue) {
                        $.ajax({
                            type: "POST",
                            url: '/yongo/issue/cleanup',
                            data: {
                            },
                            beforeSend: function() {
                                $("#modalCreateIssue").dialog('destroy');
                                $("#modalCreateIssue").empty();
                            }
                        });
                    } else {
                        $("#modalCreateIssue").dialog('destroy');
                        $("#modalCreateIssue").empty();
                    }
                }
            }
        ],
        close: function () {
            $("#modalCreateIssue").dialog('destroy');
            $("#modalCreateIssue").empty();
        }
    };

    initializeDialog(message);
}

function createIssueProcess(doNotCloseDialog) {
    // deal with mandatory flags

    var responseMandatoryFields = dealWithMandatoryFieldsInModals();
    if (responseMandatoryFields && responseMandatoryFields[1]) {
        $('#errorsMandatoryFieldsNotPresentOnScreen').html(responseMandatoryFields[1]);
        return
    }

    var fields = $("[id^='field_type_']");
    var fieldsCustom = $("[id^='field_custom_type_']");

    var attachments = $("[id^='attach_']");
    var field_types = [];
    var field_types_custom = [];
    var field_values = [];
    var field_values_custom = [];
    var i, elemId;

    // deal with the regular fields
    for (i = 0; i < fields.length; i++) {
        elemId = fields[i].getAttribute('id');
        field_types.push(elemId.replace('field_type_', ''));
        field_values.push($('#' + elemId).val());
    }

    // deal with the custom fields
    for (i = 0; i < fieldsCustom.length; i++) {
        elemId = fieldsCustom[i].getAttribute('id');
        field_types_custom.push(elemId.replace('field_custom_type_', ''));
        field_values_custom.push($('#' + elemId).val());
    }

    var attach_ids = [];
    for (i = 0; i < attachments.length; i++) {
        var check_id = attachments[i].getAttribute('id');
        var checked = ($('#' + check_id).is(':checked'));
        if (checked)
            attach_ids.push(attachments[i].getAttribute('id').replace('attach_', ''));
    }

    if (!attach_ids.length)
        attach_ids = null;

    $.ajax({
        type: "POST",
        url: '/yongo/issue/save',
        data: {
            field_types: field_types,
            field_values: field_values,
            field_types_custom: field_types_custom,
            field_values_custom: field_values_custom,
            attach_ids: attach_ids
        },
        success: function (response) {
            if (doNotCloseDialog) {
                createIssue(response);
            } else {
                $("#modalCreateIssue").dialog('destroy');
                $("#modalCreateIssue").empty();

                $('#topMessageBox').html(response);
                $('#topMessageBox').css('box-shadow', '3px 3px 5px rgba(0, 0, 0, 0.5)');
                $('#topMessageBox').show();
            }
        }
    })
}