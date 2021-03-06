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

require_once __DIR__ . '/../../_header.php';
?>
<body>

    <?php require_once __DIR__ . '/../../_menu.php'; ?>
    <div class="headerPageBackground">
        <table width="100%">
            <tr>
                <td>
                    <div class="headerPageText">
                        <a class="linkNoUnderline" href="/yongo/administration/field-configurations">Field Configurations</a> >
                        <a class="linkNoUnderline" href="/yongo/administration/field-configuration/edit/<?php echo $fieldConfiguration['id'] ?>"><?php echo $fieldConfiguration['name'] ?></a> >
                        Field: <?php echo $field['name'] ?>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div class="pageContent">
        <form name="form_edit_field_configuration_screen" action="/yongo/administration/field-configuration/edit-metadata/<?php echo $fieldConfigurationId ?>/<?php echo $fieldId ?>" method="post">

            <table width="100%">
                <tr>
                    <td width="150" valign="top">Description</td>
                    <td><textarea name="description" class="inputTextAreaLarge"><?php if (isset($description)) echo $description ?></textarea></td>
                </tr>
                <tr>
                    <td colspan="2"><hr size="1" /></td>
                </tr>
                <tr>
                    <td></td>
                    <td align="left">
                        <div align="left">
                            <button type="submit" name="edit_field_configuration" class="btn ubirimi-btn"><i class="icon-edit"></i> Update</button>
                            <a class="btn ubirimi-btn" href="/yongo/administration/field-configuration/edit/<?php echo $fieldConfigurationId ?>">Cancel</a>
                        </div>
                    </td>
                </tr>
            </table>

        </form>
    </div>
    <?php require_once __DIR__ . '/../../_footer.php' ?>
</body>
</html>