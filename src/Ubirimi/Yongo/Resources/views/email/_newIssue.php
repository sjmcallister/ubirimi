<?php
    use Ubirimi\Container\UbirimiContainer;

    $session = UbirimiContainer::get()['session'];
?>

<div style="background-color: #ffffff; border-radius: 5px; border: #CCCCCC 1px solid; padding: 10px; margin: 10px;">
    <?php require __DIR__ . '/_header.php'; ?>

    <div style="font: 17px Trebuchet MS, sans-serif;white-space: nowrap;padding-bottom: 5px;padding-top: 5px;text-align: left;padding-left: 2px;">
        <a style="text-decoration: none;" href="<?php echo $session->get('client/base_url') ?>/yongo/issue/<?php echo $this->issue['id'] ?>"><?php echo $this->issue['summary'] ?></a>
    </div>
    <div style="height: 10px"></div>

    <table width="100%" border="0">
        <tr>
            <td style="width="80">Project:</td>
            <td><a href="<?php echo $session->get('client/base_url') ?>/yongo/project/<?php echo $this->issue['issue_project_id'] ?>"><?php echo $this->issue['project_name'] ?></a></td>
        </tr>
        <tr>
            <td width="150">Issue Type:</td>
            <td><?php echo $this->issue['type_name'] ?></td>
        </tr>

        <tr>
            <td>Reporter:</td>
            <td>
                <a href="<?php echo $session->get('client/base_url') ?>/yongo/user/profile/<?php echo $this->issue['reporter'] ?>"><?php echo $this->issue['ur_first_name'] . ' ' . $this->issue['ur_last_name'] ?></a>
            </td>
        </tr>
        <tr>
            <td>Assignee:</td>
            <td>
                <?php if ($this->issue['ua_first_name']): ?>
                <a href="<?php echo $session->get('client/base_url') ?>/yongo/user/profile/<?php echo $this->issue['assignee'] ?>"><?php echo $this->issue['ua_first_name'] . ' ' . $this->issue['ua_last_name'] ?></a>
                <?php else: ?>
                    Unassigned
                <?php endif ?>
            </td>
        </tr>
        <tr>
            <td>Created:</td>
            <td><?php echo $this->issue['date_created'] ?></td>
        </tr>
        <?php if ($this->issue['due_date']): ?>
        <tr>
            <td>Due:</td>
            <td><?php echo $this->issue['due_date'] ?></td>
        </tr>
        <?php endif ?>
        <tr>
            <td valign="top" width="80">Description:</td>
            <td><?php echo str_replace("\n",  '<br />', $this->issue['description']) ?></td>
        </tr>
        <tr>
            <td>Priority:</td>
            <td><?php echo $this->issue['priority_name'] ?></td>
        </tr>
        <?php if ($this->versions_affected): ?>
        <tr>
            <td>Affects version/s:</td>
            <td>
                <?php
                    $arr_string = array();
                    while ($version = $this->versions_affected->fetch_array(MYSQLI_ASSOC)) {
                        $arr_string[] = $version['name'];
                    }
                ?>
                <?php echo implode($arr_string, ', ') ?>
            </td>
        </tr>
        <?php endif ?>
        <?php if ($this->versions_fixed): ?>
        <tr>
            <td>Fix versions:</td>
            <td>
                <?php
                    $arr_string = array();
                    while ($version = $this->versions_fixed->fetch_array(MYSQLI_ASSOC)) {
                        $arr_string[] = $version['name'];
                    }
                ?>
                <?php echo implode($arr_string, ', ') ?>
            </td>
        </tr>
        <?php endif ?>
        <?php if ($this->components): ?>
        <tr>
            <td>Components:</td>
            <td>
                <?php
                    $arr_string = array();
                    while ($component = $this->components->fetch_array(MYSQLI_ASSOC)) {
                        $arr_string[] = $component['name'];
                    }
                ?>
                <?php echo implode($arr_string, ', ') ?>
            </td>
        </tr>
        <?php endif ?>
    </table>
</div>
<?php require __DIR__ . '/_footer.php' ?>