<?php
/**
 * VnsExperimental
 *
 * @copyright Copyright (c) 2012-2013 Vinicius Oliveira Garcia
 */

namespace VnsExperimental\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class PdfController extends AbstractActionController
{
    public function indexAction()
    {
        $pdf = new \DOMPDFModule\View\Model\PdfModel();
        $pdf->setOption('filename', 'exemplo-pdf'); // Triggers PDF download, automatically appends ".pdf"
        $pdf->setOption('paperSize', 'a4'); // Defaults to "8x11"
        $pdf->setOption('paperOrientation', 'portrait'); // "portrait" or "landscape"

        return $pdf;
    }
}
