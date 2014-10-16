<?php

namespace Ubirimi\Documentador\Controller\Page;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Ubirimi\Documentador\Repository\Space\Space;
use Ubirimi\Documentador\Repository\Entity\Entity;
use Ubirimi\SystemProduct;
use Ubirimi\UbirimiController;
use Ubirimi\Util;

class AddConfirmController extends UbirimiController
{
    public function indexAction(Request $request, SessionInterface $session)
    {
        Util::checkUserIsLoggedInAndRedirect();

        $clientId = $session->get('client/id');
        $spaceId = $request->get('space_id');

        $spaces = $this->getRepository('documentador.space.space')->getByClientId($clientId);

        $entityTypes = $this->getRepository('documentador.entity.entity')->getTypes();
        $position = 1;

        return $this->render(__DIR__ . '/../../Resources/views/page/AddConfirm.php', get_defined_vars());
    }
}
