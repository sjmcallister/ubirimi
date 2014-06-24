<?php

namespace Ubirimi\Calendar\Controller\Event;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Ubirimi\Calendar\Repository\CalendarEvent;
use Ubirimi\SystemProduct;
use Ubirimi\UbirimiController;
use Ubirimi\Util;

class SearchController extends UbirimiController
{
    public function indexAction(Request $request, SessionInterface $session)
    {
        Util::checkUserIsLoggedInAndRedirect();

        $session->set('selected_product_id', SystemProduct::SYS_PRODUCT_CALENDAR);
        $menuSelectedCategory = 'calendars';

        $query = $request->get('search_query');
        $events = CalendarEvent::getByText($session->get('user/id'), $query);

        $sectionPageTitle = $session->get('client/settings/title_name') . ' / '
            . SystemProduct::SYS_PRODUCT_CALENDAR_NAME
            . ' / Search';

        return $this->render(__DIR__ . '/../../Resources/views/event/Search.php', get_defined_vars());
    }
}

