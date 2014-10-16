<?php

    use Ubirimi\Util;

    Util::checkUserIsLoggedInAndRedirect();

    $session->set('selected_product_id', -1);
    $menuSelectedCategory = 'general_overview';

    $from = $request->get('from');
    $to = $request->get('to');

    $logs = $this->getRepository('ubirimi.general.log')->getByClientIdAndInterval($clientId, $from, $to);

    $sectionPageTitle = $session->get('client/settings/title_name') . ' / General Settings / Logs';

    require_once __DIR__ . '/../Resources/views/Log.php';