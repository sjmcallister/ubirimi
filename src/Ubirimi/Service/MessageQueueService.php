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

namespace Ubirimi\Service;

use PhpAmqpLib\Connection\AMQPLazyConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Ubirimi\Container\UbirimiContainer;

class MessageQueueService
{
    public function send($queueName, $messageBody) {

        $connection = new AMQPLazyConnection(UbirimiContainer::get()['rmq.host'], UbirimiContainer::get()['rmq.port'], UbirimiContainer::get()['rmq.user'], UbirimiContainer::get()['rmq.pass']);
        $channel = $connection->channel();
        $channel->queue_declare($queueName, false, false, false, false);

        $message = new AMQPMessage($messageBody, array('delivery_mode' => 2));
        $channel->basic_publish($message, '', $queueName);
    }
}