<?php

/*
 *  Copyright (C) 2012-2014 SC Ubirimi SRL <info-copyright@ubirimi.com>
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

namespace Ubirimi\Yongo\Controller\Report;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Ubirimi\Agile\Repository\Board\Board;
use Ubirimi\UbirimiController;
use Ubirimi\Util;

class DeleteConfirmController extends UbirimiController
{
    public function indexAction(Request $request, SessionInterface $session)
    {
        Util::checkUserIsLoggedInAndRedirect();

        $filterId = $request->get('id');
        $deletePossible = $request->get('possible');

        if ($deletePossible) {
            return new Response('Are you sure you want to delete this filter?');
        }

        $boards = $this->getRepository(Board::class)->getByFilterId($filterId);

        $message = 'This filter can not be deleted due to the following reasons:';
        $message .= '<br />';

        if ($boards) {
            $message .= 'It is used in the following agile boards: ';
            $boardsName = array();
            while ($board = $boards->fetch_array(MYSQLI_ASSOC)) {
                $boardsName[] = $board['name'];
            }

            $message .= implode(', ', $boardsName) . '.';
        }

        return new Response($message);
    }
}
