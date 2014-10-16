<?php

namespace Ubirimi\Documentador\Controller\User;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Ubirimi\Documentador\Repository\Space\Space;
use Ubirimi\Documentador\Repository\Entity\Entity;
use Ubirimi\SystemProduct;
use Ubirimi\UbirimiController;
use Ubirimi\Util;

class ViewController extends UbirimiController
{
    public function indexAction(Request $request, SessionInterface $session)
    {
        if (Util::checkUserIsLoggedIn()) {

            $session->set('selected_product_id', SystemProduct::SYS_PRODUCT_DOCUMENTADOR);
        } else {
            $httpHOST = Util::getHttpHost();
            $clientId = $this->getRepository('ubirimi.general.client')->getByBaseURL($httpHOST, 'array', 'id');
            $loggedInUserId = null;

            $settingsDocumentator = $this->getRepository('ubirimi.general.client')->getDocumentatorSettings($clientId);

            $documentatorUseAnonymous = $settingsDocumentator['anonymous_use_flag'];
            $documentatorAnonymousViewUserProfiles = $settingsDocumentator['anonymous_view_user_profile_flag'];

            if (!($documentatorUseAnonymous && $documentatorAnonymousViewUserProfiles)) {
                Util::signOutAndRedirect();
                die();
            }
        }

        $userId = $request->get('id');
        $user = $this->getRepository('ubirimi.user.user')->getById($userId);
        if ($user['client_id'] != $clientId) {
            header('Location: /general-settings/bad-link-access-denied');
            die();
        }

        $menuSelectedCategory = 'documentator';
        $groups = $this->getRepository('ubirimi.user.group')->getByUserIdAndProductId($userId, SystemProduct::SYS_PRODUCT_DOCUMENTADOR);

        $sectionPageTitle = $session->get('client/settings/title_name') . ' / ' . SystemProduct::SYS_PRODUCT_DOCUMENTADOR_NAME. ' / ' . $user['first_name'] . ' ' . $user['last_name'] . ' / Summary';

        require_once __DIR__ . '/../../Resources/views/user/View.php';
    }
}