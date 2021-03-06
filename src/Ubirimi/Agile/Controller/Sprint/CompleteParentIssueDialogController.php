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

namespace Ubirimi\Agile\Controller\Sprint;

use Symfony\Component\HttpFoundation\Request;
use Ubirimi\UbirimiController;

class CompleteParentIssueDialogController extends UbirimiController
{
    public function indexAction(Request $request)
    {
        $data = $request->request->get('data');
        $dataValues = json_decode($data, true);
        $textSelected = 'checked="checked"';

        return $this->render(__DIR__ . '/../../Resources/views/sprint/CompleteParentIssueDialog.php', get_defined_vars());
    }
}
