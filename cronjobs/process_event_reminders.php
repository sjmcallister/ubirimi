<?php

/*
 *  Copyright (C) 2012-2015 SC Ubirimi SRL <info-copyright@ubirimi.com>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License version 2 as
 *  published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA.
 */

use Ubirimi\Calendar\Repository\Reminder\ReminderPeriod;
use Ubirimi\Calendar\Repository\Reminder\EventReminder;
use Ubirimi\Container\UbirimiContainer;
use Ubirimi\Repository\SMTPServer;
use Ubirimi\Util;

require_once __DIR__ . '/../web/bootstrap_cli.php';

$reminders = UbirimiContainer::get()['repository']->get(EventReminder::class)->getRemindersToBeFired();

while ($reminders && $reminder = $reminders->fetch_array(MYSQLI_ASSOC)) {
    $currentDate = Util::getServerCurrentDateTime();
    $smtpSettings = UbirimiContainer::get()['repository']->get(SMTPServer::class)->getByClientId($reminder['client_id']);

    if ($smtpSettings) {

        $reminderPeriod = $reminder['cal_event_reminder_period_id'];
        $reminderValue = $reminder['value'];

        $eventStartDate = $reminder['date_from'];

        $emailSubject = 'Reminder: ' . $reminder['name'] . ' @ ' . date('j M Y', strtotime($eventStartDate)) . ' (' . $reminder['calendar_name'] . ')';

        $emailBody = UbirimiContainer::get()['template']->render('_eventReminder.php', array(
            'event_name' => $reminder['name'],
            'when' => $eventStartDate,
            'calendar_name' => $reminder['calendar_name']));

        $dateTemporary = date_create(date('Y-m-d H:i:s', time()));

        switch ($reminderPeriod) {
            case ReminderPeriod::PERIOD_MINUTE:
                date_add($dateTemporary, date_interval_create_from_date_string($reminderValue . ' minutes'));
                $eventStartDateReminder = date_format($dateTemporary, 'Y-m-d H:i:s');
                break;
            case ReminderPeriod::PERIOD_HOUR:
                date_add($dateTemporary, date_interval_create_from_date_string($reminderValue . ' hours'));
                $eventStartDateReminder = date_format($dateTemporary, 'Y-m-d H:i:s');
                break;
            case ReminderPeriod::PERIOD_DAY:
                date_add($dateTemporary, date_interval_create_from_date_string($reminderValue . ' days'));
                $eventStartDateReminder = date_format($dateTemporary, 'Y-m-d H:i:s');
                break;
            case ReminderPeriod::PERIOD_WEEK:
                date_add($dateTemporary, date_interval_create_from_date_string($reminderValue . ' weeks'));
                $eventStartDateReminder = date_format($dateTemporary, 'Y-m-d H:i:s');
                break;
        }

        if ($eventStartDateReminder >= $eventStartDate) {

            // send the reminder
            $messageData = array(
                'from' => $smtpSettings['from_address'],
                'to' => $reminder['email'],
                'clientId' => $reminder['client_id'],
                'subject' => $emailSubject,
                'content' => $emailBody,
                'date' => Util::getServerCurrentDateTime());

            UbirimiContainer::get()['messageQueue']->send('process_email', json_encode($messageData));

            // update the reminder as fired
            UbirimiContainer::get()['repository']->get(EventReminder::class)->setAsFired($reminder['id']);
        }
    }
}