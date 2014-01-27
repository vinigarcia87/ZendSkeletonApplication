<?php
/**
 * VnsExperimental
 *
 * @copyright Copyright (c) 2012-2013 Vinicius Oliveira Garcia
 */

namespace VnsExperimental\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class ExcelController extends AbstractActionController
{
    public function indexAction()
    {
    	$objPHPExcel = new \PHPExcel();
    	
    	// Set properties
    	$objPHPExcel->getProperties()
    	->setCreator("Maarten Balliauw")
    	->setLastModifiedBy("Maarten Balliauw")
    	->setTitle("Office 2007 XLSX Test Document")
    	->setSubject("Office 2007 XLSX Test Document")
    	->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
    	->setKeywords("office 2007 openxml php")
    	->setCategory("Test result file");
    	
    	// Add some data
    	$objPHPExcel->setActiveSheetIndex(0)
    	->setCellValue('A1', 'Hello')
    	->setCellValue('B2', 'world!')
    	->setCellValue('C1', 'Hello')
    	->setCellValue('D2', 'world!');
    	
    	// Miscellaneous glyphs, UTF-8
    	$objPHPExcel->setActiveSheetIndex(0)
    	->setCellValue('A4', 'Miscellaneous glyphs')
    	->setCellValue('A5', 'õõõõééEÈÈççêÊÂãããã');
    	
    	// Rename sheet
    	$objPHPExcel->getActiveSheet()->setTitle('Simple');
    	
    	// Set active sheet index to the first sheet, so Excel opens this as the first sheet
    	$objPHPExcel->setActiveSheetIndex(0);
    	
    	// Redirect output to a client�s web browser (Excel5)
    	header('Content-Type: application/vnd.ms-excel');
    	header('Content-Disposition: attachment;filename="exemplo-excel.xls"');
    	header('Cache-Control: max-age=0');
    	
    	$objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
    	$objWriter->save('php://output');
    }
}
