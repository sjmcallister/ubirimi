$('document').ready(function () {

    function mouseIsOverElement(classElement) {
        return classElement === $('#mouseTracker').val();
    }

    $('.cal-event, .show-all-events').on('mouseenter', function (event) {
        $('#mouseTracker').val('cal-event');
    });

    $('.cal-event, .show-all-events').on('mouseleave', function (event) {
        $('#mouseTracker').val(-1);
    });

    $(document).on('click', "#add_event_repeat_after_weekly", function (event) {
        $('#add_event_repeat_end_date_after_occurrences_weekly').prop('checked', true);
    });

    $(document).on('click', "#add_event_repeat_after_daily", function (event) {
        $('#add_event_repeat_end_date_after_occurrences_daily').prop('checked', true);
    });

    $(document).on('click', "#add_event_repeat_end_date_on_weekly", function (event) {
        $('#add_event_repeat_end_date_on_weekly_label').prop('checked', true);
    });

    $(document).on('click', "#add_event_repeat_end_date_on_daily", function (event) {
        $('#add_event_repeat_end_date_on_label').prop('checked', true);
    });

    $("[id^='calendar_day_']").on('click', function (event) {

        event.preventDefault();

        if (mouseIsOverElement('cal-event') || mouseIsOverElement('show-all-events')) {

            return
        }

        $('.qtip').qtip('hide');

        var defaultDayMonthData = $(this).attr("id").replace('calendar_day_', '');
        var dataValues = defaultDayMonthData.split('_');
        var defaultDay = dataValues[0];
        var defaultMonth = dataValues[1];
        var defaultYear = dataValues[2];

        var options = {
            dialogClass: "ubirimi-dialog",
            title: 'Add Event',
            buttons: [
                {
                    text: "Create",
                    click: function () {
                        var eventName = $('#event_name').val().trim();
                        if (eventName == '') {
                            $('#eventNameEmpty').html('Event name empty');
                        } else {
                            var repeatData = '';

                            var repeatType = $('#add_event_repeat_type').val();
                            if (1 == repeatType) { // daily
                                repeatData += '1';
                                repeatData += '#' + $('#add_event_repeat_every_daily').val();
                                if ($('#add_event_repeat_end_date_never_daily').is(':checked')) {
                                    repeatData += '#n';
                                } else if ($('#add_event_repeat_end_date_after_occurrences_daily').is(':checked')) {
                                    repeatData += '#a' + $('#add_event_repeat_after_daily').val();
                                } else if ($('#add_event_repeat_end_date_on_label').is(':checked')) {
                                    repeatData += '#o' + $('#add_event_repeat_end_date_on_daily').val();
                                }

                                repeatData += '#' + $('#add_event_repeat_start_date').val();
                            } else if (2 == repeatType) {
                                repeatData += '2';
                                repeatData += '#' + $('#add_event_repeat_every_weekly').val();
                                if ($('#add_event_repeat_end_date_never_weekly').is(':checked')) {
                                    repeatData += '#n';
                                } else if ($('#add_event_repeat_end_date_after_occurrences_weekly').is(':checked')) {
                                    repeatData += '#a' + $('#add_event_repeat_after_weekly').val();
                                } else if ($('#add_event_repeat_end_date_on_weekly_label').is(':checked')) {
                                    repeatData += '#o' + $('#add_event_repeat_end_date_on_weekly').val();
                                }

                                repeatData += '#' + $('#add_event_repeat_start_date_weekly').val();

                                var dayValue = $('#week_on_0').prop('checked') ? 1 : 0;
                                repeatData += '#' + dayValue;
                                dayValue = $('#week_on_1').prop('checked') ? 1 : 0;
                                repeatData += '#' + dayValue;
                                dayValue = $('#week_on_2').prop('checked') ? 1 : 0;
                                repeatData += '#' + dayValue;
                                dayValue = $('#week_on_3').prop('checked') ? 1 : 0;
                                repeatData += '#' + dayValue;
                                dayValue = $('#week_on_4').prop('checked') ? 1 : 0;
                                repeatData += '#' + dayValue;
                                dayValue = $('#week_on_5').prop('checked') ? 1 : 0;
                                repeatData += '#' + dayValue;
                                dayValue = $('#week_on_6').prop('checked') ? 1 : 0;
                                repeatData += '#' + dayValue;
                            }
                            $.ajax({
                                type: "POST",
                                url: '/calendar/add-event',
                                data: {
                                    name: eventName,
                                    description: $('#event_description').val(),
                                    location: $('#event_location').val(),
                                    calendar: $('#event_calendar').val().split('_')[0],
                                    start: $('#event_start_date').val(),
                                    end: $('#event_end_date').val(),
                                    color: $('#event_color').val(),
                                    repeat_data: repeatData
                                },
                                success: function (response) {
                                    $("#modalAddEvent").dialog('destroy');
                                    $("#modalAddEvent").empty();
                                    location.reload();
                                }
                            });
                        }
                    }
                },
                {
                    text: "Cancel",
                    click: function () {
                        $("#modalAddEvent").dialog('destroy');
                        $("#modalAddEvent").empty();
                    }
                }
            ],
            close: function () {
                $("#modalAddEvent").dialog('destroy');
                $("#modalAddEvent").empty();
            }
        };

        $("#modalAddEvent").load("/calendar/dialog/add-event/" + defaultDay + '/' + defaultMonth + '/' + defaultYear, [], function () {
            $("#modalAddEvent").dialog(options);
            $("#modalAddEvent").dialog("open");

                $('#event_start_date, #event_end_date').datetimepicker({
                    timeFormat: "hh:mm",
                    dateFormat: "yy-mm-dd",
                    ampm: false
                });

                $('#add_event_repeat_end_date_on_daily, #add_event_repeat_end_date_on_weekly').datepicker({
                    dateFormat: "yy-mm-dd",
                    ampm: false
                });

                jscolor.init();

                $(".select2InputSmall").select2({
                    minimumResultsForSearch: -1
                });
                $(".select2InputMedium").select2();

                $('#event_name').focus();
        });
    });

    $("#btnDeleteCalendar").on('click', function (event) {
        event.preventDefault();

        if (selected_rows.length != 1) {
            return;
        }

        var calendarId = selected_rows[0];

        var options = {
            dialogClass: "ubirimi-dialog",
            title: 'Delete Calendar',
            buttons: [
                {
                    text: "Delete",
                    click: function () {

                        $.ajax({
                            type: "POST",
                            url: '/calendar/delete',
                            data: {
                                id: calendarId
                            },
                            success: function (response) {
                                $("#modalDeleteCalendar").dialog('destroy');
                                $("#modalDeleteCalendar").empty();
                                location.reload();
                            }
                        });
                    }
                },
                {
                    text: "Cancel",
                    click: function () {
                        $("#modalDeleteCalendar").dialog('destroy');
                        $("#modalDeleteCalendar").empty();
                    }
                }
            ],
            close: function () {
                $("#modalDeleteCalendar").dialog('destroy');
                $("#modalDeleteCalendar").empty();
            }
        };

        $("#modalDeleteCalendar").load("/calendar/dialog/delete/" + calendarId, [], function () {
            $("#modalDeleteCalendar").dialog(options);
            $("#modalDeleteCalendar").dialog("open");
        });
    });

    $("[id^='event_link_delete_']").on('click', function (event) {
        event.preventDefault();

        $('.qtip').qtip('hide');

        var eventId = $(this).attr("id").replace('event_link_delete_', '');

        var options = {
            dialogClass: "ubirimi-dialog",
            title: 'Delete Recurring Event',
            buttons: [
                {
                    text: "Cancel this change",
                    click: function () {
                        $("#modalDeleteRecurringEvent").dialog('destroy');
                        $("#modalDeleteRecurringEvent").empty();
                    }
                }
            ],
            close: function () {
                $("#modalDeleteRecurringEvent").dialog('destroy');
                $("#modalDeleteRecurringEvent").empty();
            }
        };

        $("#modalDeleteRecurringEvent").load("/calendar/event/delete/dialog/" + eventId, [], function () {
            $("#modalDeleteRecurringEvent").dialog(options);
            $("#modalDeleteRecurringEvent").dialog("open");
        });
    });

    $("#btnShareCalendar").on('click', function (event) {
        event.preventDefault();

        if (selected_rows.length != 1)
            return;

        var calendarId = selected_rows[0];

        var options = {
            dialogClass: "ubirimi-dialog",
            title: 'Share Calendar',
            buttons: [
                {
                    text: "Share",
                    click: function () {
                        var users = $('#user_to_share').val();

                        $.ajax({
                            type: "POST",
                            url: '/calendar/share',
                            data: {
                                id: calendarId,
                                note: $('#share_calendar_note').val(),
                                user_id: users
                            },
                            success: function (response) {
                                $("#modalShareCalendar").dialog('destroy');
                                $("#modalShareCalendar").empty();
                                //location.reload();
                            }
                        });
                    }
                },
                {
                    text: "Cancel",
                    click: function () {
                        $("#modalShareCalendar").dialog('destroy');
                        $("#modalShareCalendar").empty();
                    }
                }
            ],
            close: function () {
                $("#modalShareCalendar").dialog('destroy');
                $("#modalShareCalendar").empty();
            }
        };

        $("#modalShareCalendar").load("/calendar/dialog/share/" + calendarId, [], function () {
            $("#modalShareCalendar").dialog(options);
            $("#modalShareCalendar").dialog("open");
            $(".select2Input").select2();
        });
    });

    $("#btnEventAddGuests").on('click', function (event) {
        event.preventDefault();

        var eventId = $('#event_id').val();

        var options = {
            dialogClass: "ubirimi-dialog",
            title: 'Add Guests to Event',
            buttons: [
                {
                    text: "Add Guests",
                    click: function () {
                        var users = $('#user_to_share').val();

                        if (users == null) {
                            $('#share_no_user_selected').html('Please select a user');
                            return
                        }

                        $.ajax({
                            type: "POST",
                            url: '/calendar/event/add-guests',
                            data: {
                                id: eventId,
                                note: $('#share_event_note').val(),
                                user_id: users
                            },
                            success: function (response) {
                                $("#modalAddGuestsToEvent").dialog('destroy');
                                $("#modalAddGuestsToEvent").empty();

                                location.reload();
                            }
                        });
                    }
                },
                {
                    text: "Cancel",
                    click: function () {
                        $("#modalAddGuestsToEvent").dialog('destroy');
                        $("#modalAddGuestsToEvent").empty();
                    }
                }
            ],
            close: function () {
                $("#modalAddGuestsToEvent").dialog('destroy');
                $("#modalAddGuestsToEvent").empty();
            }
        };

        $("#modalAddGuestsToEvent").load("/calendar/event/dialog/add-guests/" + eventId, [], function () {
            $("#modalAddGuestsToEvent").dialog(options);
            $("#modalAddGuestsToEvent").dialog("open");
            $(".select2Input").select2({placeholder_text: 'Click to select a user'});
        });
    });

    $("#btnEventDelete").on('click', function (event) {
        event.preventDefault();

        var eventId = $('#event_id').val();

        var options = {
            dialogClass: "ubirimi-dialog",
            title: 'Delete Event',
            buttons: [
                {
                    text: "Delete",
                    click: function () {
                        $.ajax({
                            type: "POST",
                            url: '/calendar/event/delete',
                            data: {
                                id: eventId
                            },
                            success: function (response) {
                                $("#modalDeleteEvent").dialog('destroy');
                                $("#modalDeleteEvent").empty();
                                window.location.href = '/' + $('#calendar_link').val();
                            }
                        });
                    }
                },
                {
                    text: "Cancel",
                    click: function () {
                        $("#modalDeleteEvent").dialog('destroy');
                        $("#modalDeleteEvent").empty();
                    }
                }
            ],
            close: function () {
                $("#modalDeleteEvent").dialog('destroy');
                $("#modalDeleteEvent").empty();
            }
        };

        $("#modalDeleteEvent").load("/calendar/event/dialog/delete/" + eventId, [], function () {
            $("#modalDeleteEvent").dialog(options);
            $("#modalDeleteEvent").dialog("open");
        });
    });
});