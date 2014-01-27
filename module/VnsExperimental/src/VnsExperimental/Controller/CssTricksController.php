<?php
/**
 * VnsExperimental
 *
 * @copyright Copyright (c) 2012-2013 Vinicius Oliveira Garcia
 */

namespace VnsExperimental\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class CssTricksController extends AbstractActionController
{
    public function indexAction()
    {
        return new ViewModel();
    }
}
