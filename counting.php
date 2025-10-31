<?php
// header('Content-Type: application/json');

// Include database connection
require_once 'connect.php';

// Portfolio mapping: short form to full name
$portfolioMapping = [
    'VP' => 'VICE PRESIDENT',
    'GS' => 'GENERAL SECRETARY',
    'AGS' => 'ASSISTANT GENERAL SECRETARY',
    'CS' => 'CULTURAL SECRETARY',
    'LS' => 'LITERARY SECRETARY',
    'DSS' => 'DEBATE & SYMPOSIUM SECRETARY',
    'MAJGS' => 'MAJOR GAMES SECRETARY',
    'MINGS' => 'MINOR GAMES SECRETARY',
    'SSNSS' => 'SOCIAL SERVICE & NSS SECRETARY',
    'MPAS' => 'MUSIC & PERFORMING ARTS SECRETARY',
    'GWS' => 'GIRLS\' WELFARE SECRETARY',
    'BWS' => 'BOYS\' WELFARE SECRETARY',
    'AAS' => 'ACADEMIC AFFAIRS SECRETARY'
];

$portfolioData = [];
$portfolios = [];

try {
    // Loop through each portfolio
    foreach ($portfolioMapping as $shortForm => $fullName) {
        // Query to count votes for each candidate in this portfolio
        $sql = "SELECT $shortForm as candidate_name, COUNT(*) as vote_count 
                FROM voting 
                WHERE $shortForm IS NOT NULL AND $shortForm != '' 
                GROUP BY $shortForm 
                ORDER BY vote_count DESC";
        
        $result = $conn->query($sql);
        
        if ($result) {
            $candidates = [];
            $position = 1;
            
            while ($row = $result->fetch_assoc()) {
                $candidates[] = [
                    'position' => $position,
                    'name' => strtoupper(trim($row['candidate_name'])),
                    'votes' => (int)$row['vote_count']
                ];
                $position++;
            }
            
            // Only add portfolio if it has candidates
            if (count($candidates) > 0) {
                $portfolioData[$fullName] = $candidates;
                $portfolios[] = $fullName;
            }
        }
    }
    
    // Prepare response
    $response = [
        'success' => true,
        'portfolioData' => $portfolioData,
        'portfolios' => $portfolios
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // Error response
    $response = [
        'success' => false,
        'error' => $e->getMessage(),
        'portfolioData' => [],
        'portfolios' => []
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
}

$conn->close();
?>