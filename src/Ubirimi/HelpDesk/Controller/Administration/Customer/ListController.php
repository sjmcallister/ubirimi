<?php

namespace Ubirimi\HelpDesk\Controller\Administration\Customer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Ubirimi\HelpDesk\Repository\Organization\Customer;
use Ubirimi\HelpDesk\Repository\Organization\Organization;
use Ubirimi\Repository\User\UbirimiUser;
use Ubirimi\SystemProduct;
use Ubirimi\UbirimiController;
use Ubirimi\Util;

class ListController extends UbirimiController
{
    public function indexAction(Request $request, SessionInterface $session)
    {
        Util::checkUserIsLoggedInAndRedirect();
        $organizationId = $request->query->get('id');

        if ($organizationId) {
            $customers = $this->getRepository(Customer::class)->getByOrganizationId($organizationId);
            $organization = $this->getRepository(Organization::class)->getById($organizationId);
            $breadCrumbTitle = 'Customers > ' . $organization['name'];
        } else {
            $customers = $this->getRepository(UbirimiUser::class)->getByClientId($session->get('client/id'), 1);
            $breadCrumbTitle = 'Customers > All';
        }

        $menuSelectedCategory = 'helpdesk_organizations';

        $sectionPageTitle = $session->get('client/settings/title_name')
            . ' / ' . SystemProduct::SYS_PRODUCT_HELP_DESK_NAME
            . ' / Administration / Customers';

        return $this->render(__DIR__ . '/../../../Resources/views/administration/customer/List.php', get_defined_vars());
    }
}
