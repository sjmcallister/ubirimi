<?php

namespace Ubirimi\Documentador\Controller\Space;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Ubirimi\Documentador\Repository\Space\Space;
use Ubirimi\Documentador\Repository\Entity\Entity;
use Ubirimi\SystemProduct;
use Ubirimi\UbirimiController;
use Ubirimi\Util;

class FindPageController extends UbirimiController
{
    public function indexAction(Request $request, SessionInterface $session)
    {
        Util::checkUserIsLoggedInAndRedirect();

        $clientId = $session->get('client/id');

        $spaceId = $request->request->get('space_id');
        $pageNameKeyword = $request->request->get('page');

        $pages = $this->getRepository('documentador.entity.entity')->findBySpaceIdAndKeyword($clientId, $spaceId, $pageNameKeyword);

        return $this->render(__DIR__ . '/../../../Resources/views/page/Find.php', get_defined_vars());
    }
}